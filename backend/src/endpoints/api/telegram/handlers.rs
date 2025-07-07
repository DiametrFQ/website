use actix_web::{HttpResponse, get, http::header::ContentType, web};

use super::errors::AppError;
use super::services;
use crate::endpoints::app_state::AppState;

#[get("")]
pub async fn get_telegram_posts_handler(state: web::Data<AppState>) -> HttpResponse {
    let result = services::fetch_telegram_posts(state.rss_fetcher.as_ref()).await;

    match result {
        Ok(posts) => match serde_json::to_string(&posts) {
            Ok(json_body) => HttpResponse::Ok()
                .content_type(ContentType::json())
                .body(json_body),
            Err(e) => {
                log::error!("JSON serialization failed: {:?}", e);
                HttpResponse::InternalServerError().finish()
            }
        },
        Err(AppError::ServiceErrorWithFallback) => HttpResponse::Ok()
            .content_type(ContentType::json())
            .body("[]"),
        Err(other_error) => {
            log::error!("An unhandled error occurred: {:?}", other_error);
            HttpResponse::InternalServerError().finish()
        }
    }
}
