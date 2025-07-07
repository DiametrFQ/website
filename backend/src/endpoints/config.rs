use crate::endpoints::{api, metrics};
use actix_web::web;

pub fn config_services(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .configure(metrics::routes::config)
            .configure(api::routes::config),
    );
}
