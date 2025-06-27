use backend::spotify::services::SpotifyService;
use actix_web::{web, App, HttpServer};
use backend::config::config_services;
use dotenvy::dotenv;
use std::env;
use std::sync::{Arc, Mutex}; 
use backend::telegram::services::{RssFetcher, RealRssFetcher};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
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
    
    let spotify_data = web::Data::new(Mutex::new(spotify_service));

    let rss_fetcher = RealRssFetcher;
    let telegram_data: web::Data<Arc<dyn RssFetcher + Send + Sync>> = web::Data::new(Arc::new(rss_fetcher));

    HttpServer::new(move || {
        App::new()
            .app_data(spotify_data.clone())
            .app_data(telegram_data.clone())
            .configure(config_services)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
