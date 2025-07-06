use super::handlers;
use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route("/metrics", web::get().to(handlers::metrics_handler));
}
