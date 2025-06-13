use actix_web::{web, App, HttpServer, middleware::Logger};
use std::io::Result;
use std::sync::Arc;

use backend::config::config_services;
use backend::telegram;

#[actix_web::main]
async fn main() -> Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    dotenvy::dotenv().ok();

    let server_address = "0.0.0.0";
    let server_port = 8080; // Выберите порт для Rust бэкенда

    log::info!("Starting server at http://{}:{}", server_address, server_port);

    let real_fetcher = Arc::new(telegram::services::RealRssFetcher);

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            // Добавляем fetcher в состояние приложения
            .app_data(web::Data::from(real_fetcher.clone())) 
            .configure(config_services)
    })
    .bind((server_address, server_port))?
    .run()
    .await
}