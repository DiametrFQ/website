use actix_web::web;
use crate::telegram;

pub fn config_services(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .configure(telegram::routes::config)
    );
}