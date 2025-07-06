use actix_web::{HttpResponse, Responder, web};
use actix_web_prom::PrometheusMetrics;

pub async fn metrics_handler(prometheus_metrics: web::Data<PrometheusMetrics>) -> impl Responder {
    let body = prometheus_metrics.registry.gather();
    let text = prometheus::TextEncoder::new()
        .encode_to_string(&body)
        .unwrap_or_else(|e| {
            log::error!("Failed to encode prometheus metrics: {}", e);
            String::new()
        });

    HttpResponse::Ok()
        .content_type(prometheus::TEXT_FORMAT)
        .body(text)
}
