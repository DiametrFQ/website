use crate::spotify::handlers;
use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/spotify")
            .route(
                "/now_playing",
                web::get().to(handlers::get_now_playing_handler), 
            )
            .route(
                "/now_playing_stream",
                web::get().to(handlers::now_playing_stream_handler),
            ),
    );
}