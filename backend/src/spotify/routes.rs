use crate::spotify::handlers;
use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    println!("Spotify routes configured successfully.");
    println!("/spotify/now_playing: Get current playing track");
    println!("/spotify/now_playing_stream: Stream current playing track updates");

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