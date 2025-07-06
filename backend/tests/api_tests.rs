use actix_web::{App, http, test, web};
use async_trait::async_trait;
use backend::{
    common::errors::{AppError, AppResult},
    endpoints::{
        config::config_services,
        spotify::services::SpotifyService,
        telegram::{models::Post, services::RssFetcher},
    },
};
use bytes::Bytes;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
struct MockSuccessFetcher;

#[async_trait]
impl RssFetcher for MockSuccessFetcher {
    async fn fetch_rss_content(&self, _url: &str) -> AppResult<Bytes> {
        let fake_rss = r#"<rss version="2.0"><channel><item><title>Success Post</title><link>url</link><description>desc</description></item></channel></rss>"#;
        Ok(Bytes::from(fake_rss))
    }
}

#[derive(Clone)]
struct MockFallbackFetcher;

#[async_trait]
impl RssFetcher for MockFallbackFetcher {
    async fn fetch_rss_content(&self, _url: &str) -> AppResult<Bytes> {
        Err(AppError::ServiceErrorWithFallback)
    }
}

#[derive(Clone)]
struct MockInternalErrorFetcher;

#[async_trait]
impl RssFetcher for MockInternalErrorFetcher {
    async fn fetch_rss_content(&self, _url: &str) -> AppResult<Bytes> {
        Err(AppError::InternalError("critical failure".into()))
    }
}

// --- Integration tests API (TELEGRAM) ---

#[actix_web::test]
async fn test_telegram_success_returns_200_with_posts() {
    let mock = Arc::new(MockSuccessFetcher);
    let app = test::init_service(
        App::new()
            .app_data(web::Data::from(mock as Arc<dyn RssFetcher + Send + Sync>))
            .configure(config_services),
    )
    .await;

    let req = test::TestRequest::get().uri("/api/telegram").to_request();
    let resp = test::call_service(&app, req).await;

    assert_eq!(resp.status(), http::StatusCode::OK);
    let posts: Vec<Post> = test::read_body_json(resp).await;
    assert!(!posts.is_empty());
    assert_eq!(posts[0].title, "Success Post");
}

#[actix_web::test]
async fn test_telegram_fallback_returns_200_with_empty_array() {
    let mock = Arc::new(MockFallbackFetcher);
    let app = test::init_service(
        App::new()
            .app_data(web::Data::from(mock as Arc<dyn RssFetcher + Send + Sync>))
            .configure(config_services),
    )
    .await;

    let req = test::TestRequest::get().uri("/api/telegram").to_request();
    let resp = test::call_service(&app, req).await;
    assert_eq!(resp.status(), http::StatusCode::OK);

    let posts: Vec<Post> = test::read_body_json(resp).await;
    assert!(posts.is_empty());
}

#[actix_web::test]
async fn test_telegram_internal_error_returns_500() {
    let mock = Arc::new(MockInternalErrorFetcher);
    let app = test::init_service(
        App::new()
            .app_data(web::Data::from(mock as Arc<dyn RssFetcher + Send + Sync>))
            .configure(config_services),
    )
    .await;

    let req = test::TestRequest::get().uri("/api/telegram").to_request();
    let resp = test::call_service(&app, req).await;

    assert_eq!(resp.status(), http::StatusCode::INTERNAL_SERVER_ERROR);
}

// --- Integration tests API (SPOTIFY) ---

#[actix_web::test]
async fn test_spotify_stream_returns_sse_data() {
    let mock_spotify_service =
        SpotifyService::new("test_id".into(), "test_secret".into(), "test_token".into());

    let spotify_data = web::Data::new(Mutex::new(mock_spotify_service));

    let app = test::init_service(
        App::new()
            .app_data(spotify_data.clone())
            .configure(config_services),
    )
    .await;

    let req = test::TestRequest::get()
        .uri("/api/spotify/now_playing_stream")
        .to_request();

    let resp = test::call_service(&app, req).await;

    assert_eq!(resp.status(), http::StatusCode::OK);
    assert_eq!(
        resp.headers().get("content-type").unwrap(),
        "text/event-stream"
    );

    let body_bytes = test::read_body(resp).await;
    let body_str = std::str::from_utf8(&body_bytes).unwrap();

    assert!(body_str.contains(r#""isPlaying":false"#));
}
