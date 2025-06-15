use actix_web::{
    error::Error,
    http::header::{self, ContentType},
    mime, web, HttpResponse, Responder, ResponseError,
};
use futures_util::StreamExt;
use super::services;
type SpotifyTokenCache = std::sync::Mutex<Option<(String, std::time::Instant)>>;


pub async fn get_now_playing_handler(
    token_cache: web::Data<SpotifyTokenCache>
) -> impl Responder {
    match services::get_now_playing(token_cache.get_ref()).await {
        Ok(now_playing_data) => HttpResponse::Ok().json(now_playing_data),
        Err(e) => {
            log::error!("Error in now_playing handler: {:?}", e);
            e.error_response()
        }
    }
}

pub async fn now_playing_stream_handler(
    token_cache: web::Data<SpotifyTokenCache>
) -> impl Responder {
    let stream = services::now_playing_stream(token_cache.clone());

    HttpResponse::Ok()
        .insert_header(ContentType(mime::TEXT_EVENT_STREAM))
        .insert_header((header::CACHE_CONTROL, "no-cache"))
        .insert_header((header::CONNECTION, "keep-alive"))
        .streaming(stream.map(|result| -> Result<web::Bytes, Error> {
            match result {
                Ok(data_string) => Ok(web::Bytes::from(format!("data: {}\n\n", data_string))),
                Err(e) => {
                    log::error!("Error in stream: {:?}", e);
                    // Можно отправлять событие с ошибкой на фронт, но пока просто пропустим
                    Ok(web::Bytes::new())
                }
            }
        }))
}