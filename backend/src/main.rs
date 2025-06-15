use std::io::Result;
use std::sync::Arc;
use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_web_prom::PrometheusMetricsBuilder;
use std::sync::{Mutex};
use std::time::Instant;

use backend::config::config_services;
use backend::telegram;

#[actix_web::main]
async fn main() -> Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    dotenvy::dotenv().ok();

    let server_address = "0.0.0.0";
    let server_port = 8080; 

    log::info!("Starting server at http://{}:{}", server_address, server_port);

    let spotify_token_cache = web::Data::new(Mutex::new(None::<(String, Instant)>));

    let real_fetcher = Arc::new(telegram::services::RealRssFetcher);
    
    let prometheus = PrometheusMetricsBuilder::new("backend")
        .endpoint("/metrics")
        .build()
        .unwrap();

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(prometheus.clone())
            .app_data(web::Data::from(real_fetcher.clone()))
            .app_data(spotify_token_cache.clone()) 
            .configure(config_services)
    })
    .bind((server_address, server_port))?
    .run()
    .await
}