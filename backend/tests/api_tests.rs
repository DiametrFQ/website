use actix_web::{test, web, App, http};
use backend::config::config_services;
use backend::errors::{AppError, AppResult};
use backend::telegram::{services::RssFetcher};
use async_trait::async_trait;
use bytes::Bytes;
use std::sync::Arc;


// #[derive(Clone)]
// struct MockSuccessFetcher;

// #[async_trait]
// impl RssFetcher for MockSuccessFetcher {
//     async fn fetch_rss_content(&self, _url: &str) -> AppResult<Bytes> {
//         let fake_rss = r#"<rss version="2.0"><channel><item><title>Success Post</title><link>url</link><description>desc</description></item></channel></rss>"#;
//         Ok(Bytes::from(fake_rss))
//     }
// }

// #[derive(Clone)]
// struct MockFallbackFetcher; // Переименовал для ясности

// #[async_trait]
// impl RssFetcher for MockFallbackFetcher {
//     async fn fetch_rss_content(&self, _url: &str) -> AppResult<Bytes> {
//         // Имитируем ошибку 503 от rsshub
//         Err(AppError::ServiceErrorWithFallback)
//     }
// }

#[derive(Clone)]
struct MockInternalErrorFetcher;

#[async_trait]
impl RssFetcher for MockInternalErrorFetcher {
    async fn fetch_rss_content(&self, _url: &str) -> AppResult<Bytes> {
        // Имитируем критическую, непредвиденную ошибку
        Err(AppError::InternalError("critical failure".into()))
    }
}

// --- Интеграционные тесты API ---

// #[actix_web::test]
// async fn test_success_returns_200_with_posts() {
//     let mock = Arc::new(MockSuccessFetcher);
//     let app = test::init_service(
//         App::new().app_data(web::Data::from(mock as Arc<dyn RssFetcher + Send + Sync>)).configure(config_services),
//     ).await;

//     let req = test::TestRequest::get().uri("/api/telegram").to_request();
//     let resp = test::call_service(&app, req).await;

//     // 1. Проверяем, что статус 200 OK
//     assert_eq!(resp.status(), http::StatusCode::OK);
    
//     // 2. Читаем тело и проверяем, что в нем есть посты
//     let posts: Vec<Post> = test::read_body_json(resp).await;
//     assert!(!posts.is_empty(), "Posts array should not be empty on success");
//     assert_eq!(posts[0].title, "Success Post");
// }

// #[actix_web::test]
// async fn test_fallback_returns_200_with_empty_array() {
//     let mock = Arc::new(MockFallbackFetcher);
//     let app = test::init_service(
//         App::new().app_data(web::Data::from(mock as Arc<dyn RssFetcher + Send + Sync>)).configure(config_services),
//     ).await;

//     let req = test::TestRequest::get().uri("/api/telegram").to_request();
//     let resp = test::call_service(&app, req).await;

//     assert_eq!(resp.status(), http::StatusCode::OK, "Status should be 200 OK on fallback");

//     let posts: Vec<Post> = test::read_body_json(resp).await;
//     assert!(posts.is_empty(), "Should return an empty array on fallback");
// }

#[actix_web::test]
async fn test_internal_error_returns_500() {
    let mock = Arc::new(MockInternalErrorFetcher);
    let app = test::init_service(
        App::new().app_data(web::Data::from(mock as Arc<dyn RssFetcher + Send + Sync>)).configure(config_services),
    ).await;

    let req = test::TestRequest::get().uri("/api/telegram").to_request();
    let resp = test::call_service(&app, req).await;

    // Проверяем, что в случае критической ошибки мы возвращаем 500
    assert_eq!(resp.status(), http::StatusCode::INTERNAL_SERVER_ERROR);
}