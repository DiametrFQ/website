use actix_web::{http, test, web, App};
use async_trait::async_trait;
use backend::{
    config::config_services,
    errors::{AppError, AppResult},
    spotify::{
        services::SpotifyService,
    },
    telegram::{models::Post, services::RssFetcher},
};
use bytes::Bytes;
use std::sync::{Arc, Mutex};

// --- МОКИ ДЛЯ TELEGRAM ---

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


// --- ИНТЕГРАЦИОННЫЕ ТЕСТЫ API (TELEGRAM) ---

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


// --- ИНТЕГРАЦИОННЫЙ ТЕСТ API (SPOTIFY) ---

#[actix_web::test]
async fn test_spotify_stream_returns_sse_data() {
    // 1. Создаем мок-сервис Spotify. В реальном приложении он бы ходил в API,
    // а в тесте он просто возвращает заранее заданные данные.
    // Нам даже не нужно реализовывать для него трейт, т.к. мы используем конкретный тип.
    let mock_spotify_service = SpotifyService::new(
        "test_id".into(), 
        "test_secret".into(), 
        "test_token".into()
    );
    
    // 2. Оборачиваем его в Mutex и web::Data, как в main.rs
    let spotify_data = web::Data::new(Mutex::new(mock_spotify_service));

    // 3. Инициализируем тестовое приложение и ПРЕДОСТАВЛЯЕМ ДАННЫЕ
    let app = test::init_service(
        App::new()
            // Вот ключевая строка, которая исправляет ошибку!
            .app_data(spotify_data.clone())
            .configure(config_services),
    )
    .await;

    // 4. Делаем запрос к нашему стриминг-эндпоинту
    let req = test::TestRequest::get()
        .uri("/api/spotify/now_playing_stream")
        .to_request();
    
    let resp = test::call_service(&app, req).await;

    // 5. Проверяем, что ответ успешный и имеет правильный Content-Type
    assert_eq!(resp.status(), http::StatusCode::OK);
    assert_eq!(
        resp.headers().get("content-type").unwrap(),
        "text/event-stream"
    );

    // (Опционально) Можно даже прочитать первый элемент из потока и проверить его содержимое.
    // Это более сложный тест, но показывает, как работать со стримом.
    let body_bytes = test::read_body(resp).await;
    let body_str = std::str::from_utf8(&body_bytes).unwrap();
    
    // Ожидаем, что первый ответ будет "не играю", т.к. мок-сервис пустой
    assert!(body_str.contains(r#""isPlaying":false"#));
}