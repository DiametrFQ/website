use actix_web::web;
use super::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/telegram") // Префикс для всех роутов этого модуля
            .route("", web::get().to(handlers::get_telegram_posts_handler)),
    );
}