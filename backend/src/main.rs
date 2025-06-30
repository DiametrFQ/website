use actix_web::middleware::Logger;
use actix_web::{App, HttpServer, web};
use backend::config::config_services;
use backend::{app_state::AppState, spotify::services::SpotifyService};
use dotenvy::dotenv;
use std::env;
use std::panic;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    panic::set_hook(Box::new(|panic_info| {
        eprintln!("A thread has panicked! Panic details: {}", panic_info);
    }));

    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let spotify_client_id = env::var("SPOTIFY_CLIENT_ID").expect("SPOTIFY_CLIENT_ID must be set");
    let spotify_client_secret =
        env::var("SPOTIFY_CLIENT_SECRET").expect("SPOTIFY_CLIENT_SECRET must be set");
    let spotify_refresh_token =
        env::var("SPOTIFY_REFRESH_TOKEN").expect("SPOTIFY_REFRESH_TOKEN must be set");

    let spotify_service = SpotifyService::new(
        spotify_client_id,
        spotify_client_secret,
        spotify_refresh_token,
    );

    let app_state = web::Data::new(AppState::new(spotify_service));

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(app_state.clone())
            .configure(config_services)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
