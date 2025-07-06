use crate::endpoints::{metrics, spotify, telegram};
use actix_web::web;

pub fn config_services(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api")
            .configure(metrics::routes::config)
            .configure(spotify::routes::config)
            .configure(telegram::routes::config),
    );
}
