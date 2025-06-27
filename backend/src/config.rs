use crate::spotify;
use crate::telegram;
use actix_web::web;

pub fn config_services(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
        .configure(spotify::routes::config)
        .configure(telegram::routes::config),
    );
}
