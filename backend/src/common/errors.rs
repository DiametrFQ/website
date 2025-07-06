use actix_web::{HttpResponse, error::ResponseError};
use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Reqwest Error: {0}")]
    RequestError(#[from] reqwest::Error),

    #[error("RSS Parsing Error: {0}")]
    RssError(#[from] rss::Error),

    #[error("IO Error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("External Service Failed, Fallback requested")]
    ServiceErrorWithFallback,

    #[error("Internal Server Error: {0}")]
    InternalError(String),
}

#[derive(Serialize)]
struct ErrorResponse {
    message: String,
}

impl ResponseError for AppError {
    fn error_response(&self) -> HttpResponse {
        log::error!("A ResponseError occurred: {}", self);

        HttpResponse::InternalServerError().json(ErrorResponse {
            message: "An internal server error occurred. Please try again later.".to_string(),
        })
    }
}

pub type AppResult<T> = Result<T, AppError>;
