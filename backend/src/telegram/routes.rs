use super::handlers;
use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/telegram")
            .route("", web::get().to(handlers::get_telegram_posts_handler)),
    );
}
