use actix_web::{App, HttpServer, middleware::Logger, web};
use backend::endpoints::{app_state::AppState, config::config_services};
use dotenvy::dotenv;
use std::panic;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    panic::set_hook(Box::new(|panic_info| {
        eprintln!("A thread has panicked! Panic details: {}", panic_info);
    }));
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let app_state = web::Data::new(AppState::new());
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
