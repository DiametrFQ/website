use std::io::Result;
use std::sync::Arc;
use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_web_prom::PrometheusMetricsBuilder;
use prometheus::Registry;

use backend::config::config_services;
use backend::telegram;

#[actix_web::main]
async fn main() -> Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    dotenvy::dotenv().ok();

    let server_address = "0.0.0.0";
    let server_port = 8080; 

    log::info!("Starting server at http://{}:{}", server_address, server_port);

    let real_fetcher = Arc::new(telegram::services::RealRssFetcher);
    
    let prometheus = PrometheusMetricsBuilder::new("backend")
        .endpoint("/metrics")
        .build()
        .unwrap();

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(prometheus.clone()) // Add Prometheus middleware
            .app_data(web::Data::from(real_fetcher.clone())) 
            .configure(config_services)
    })
    .bind((server_address, server_port))?
    .run()
    .await
}