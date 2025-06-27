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
        // Логируем любую ошибку, дошедшую до этого обработчика.
        log::error!("A ResponseError occurred: {}", self);

        // Для всех ошибок, которые мы не обработали вручную в хендлере,
        // возвращаем стандартный ответ 500.
        // AppError::ServiceErrorWithFallback сюда попадать не должна.
        HttpResponse::InternalServerError().json(ErrorResponse {
            message: "An internal server error occurred. Please try again later.".to_string(),
        })
    }
}

// Удобный тип Result для нашего приложения
pub type AppResult<T> = Result<T, AppError>;
