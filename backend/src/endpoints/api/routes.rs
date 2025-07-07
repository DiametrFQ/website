use super::api::{spotify, telegram};
use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .configure(spotify::routes::config)
            .configure(telegram::routes::config),
    );
}
