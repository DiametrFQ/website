use crate::endpoints::spotify::handlers;
use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/spotify")
            .service(handlers::get_now_playing_handler)
            .service(handlers::now_playing_stream_handler),
    );
}
