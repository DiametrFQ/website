use actix_web::{web, HttpResponse, http::header::ContentType};
use std::sync::Arc;

use crate::errors::AppError;
use crate::telegram::services::RssFetcher;
use super::services;

pub async fn get_telegram_posts_handler(
    fetcher: web::Data<Arc<dyn RssFetcher + Send + Sync>>
) -> HttpResponse {
    let result = services::fetch_telegram_posts(fetcher.get_ref().as_ref()).await;

    match result {
        Ok(posts) => {
            match serde_json::to_string(&posts) {
                Ok(json_body) => HttpResponse::Ok()
                                    .content_type(ContentType::json())
                                    .body(json_body),
                Err(e) => {
                    log::error!("JSON serialization failed: {:?}", e);
                    HttpResponse::InternalServerError().finish()
                }
            }
        }
        Err(AppError::ServiceErrorWithFallback) => {
            HttpResponse::Ok()
                .content_type(ContentType::json())
                .body("[]") // Просто возвращаем строку
        }
        Err(other_error) => {
            log::error!("An unhandled error occurred: {:?}", other_error);
            HttpResponse::InternalServerError().finish()
        }
    }
}