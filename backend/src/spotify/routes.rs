use actix_web::web;
use super::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/spotify")
            .route("/now-playing", web::get().to(handlers::get_now_playing_handler))
            .route("/now-playing-stream", web::get().to(handlers::now_playing_stream_handler)),
    );
}