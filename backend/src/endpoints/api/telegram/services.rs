use super::errors::{AppError, AppResult};
use super::models::{Post, TelegramCache};
use async_trait::async_trait;
use bytes::Bytes;
use rss::Channel;
use scraper::Html;
use std::time::{Duration, Instant};
use tokio::sync::Mutex;

const TELEGRAM_CHANNEL: &str = "diametrpd";
const CACHE_TTL_SECONDS: u64 = 600;

#[async_trait]
pub trait RssFetcher {
    async fn fetch_rss_content(&self, url: &str) -> AppResult<Bytes>;
}

pub struct RealRssFetcher;

#[async_trait]
impl RssFetcher for RealRssFetcher {
    async fn fetch_rss_content(&self, url: &str) -> AppResult<Bytes> {
        let response = reqwest::get(url).await.map_err(|e| {
            log::error!("Network error while fetching RSS: {}", e);
            AppError::ServiceErrorWithFallback
        })?;

        if !response.status().is_success() {
            log::error!(
                "External service responded with non-success status: {}",
                response.status()
            );
            return Err(AppError::ServiceErrorWithFallback);
        }

        Ok(response.bytes().await?)
    }
}

pub async fn fetch_telegram_posts(
    fetcher: &(dyn RssFetcher + Sync),
    cache_mutex: &Mutex<Option<TelegramCache>>, 
) -> AppResult<Vec<Post>> {
    
    {
        let cache_guard = cache_mutex.lock().await;
        if let Some(cache) = &*cache_guard {
            if cache.last_updated.elapsed() < Duration::from_secs(CACHE_TTL_SECONDS) {
                log::info!("Returning Telegram posts from CACHE");
                return Ok(cache.posts.clone());
            }
        }
    }

    log::info!("Cache expired or empty, fetching from RSS...");
    let feed_url = format!("https://rsshub.app/telegram/channel/{}", TELEGRAM_CHANNEL);
    
    let fetch_result = fetcher.fetch_rss_content(&feed_url).await;

    match fetch_result {
        Ok(content) => {
            let channel = Channel::read_from(&content[..]).map_err(|e| {
                log::error!("Failed to parse RSS feed: {}", e);
                AppError::ServiceErrorWithFallback
            })?;

            let posts: Vec<Post> = channel
                .items()
                .iter()
                .map(|item| {
                    let raw_html_snippet = item
                        .description()
                        .unwrap_or_else(|| item.content().unwrap_or(""))
                        .to_string();
                    let plain_text_snippet = html_to_plaintext(&raw_html_snippet);
                    Post {
                        title: item.title().unwrap_or("Без заголовка").to_string(),
                        link: item.link().unwrap_or("#").to_string(),
                        content_snippet: plain_text_snippet,
                        image_url: extract_image_url(item),
                    }
                })
                .collect();

            {
                let mut cache_guard = cache_mutex.lock().await;
                *cache_guard = Some(TelegramCache {
                    posts: posts.clone(),
                    last_updated: Instant::now(),
                });
            }
            log::info!("Telegram posts updated successfully");
            Ok(posts)
        }
        Err(e) => {
            log::warn!("Failed to fetch new posts: {}. Trying fallback to stale cache.", e);
            let cache_guard = cache_mutex.lock().await;
            if let Some(cache) = &*cache_guard {
                log::info!("Returning STALE Telegram posts from cache");
                return Ok(cache.posts.clone());
            }
            Err(e)
        }
    }
}

fn html_to_plaintext(html_content: &str) -> String {
    if html_content.is_empty() {
        return String::new();
    }
    let document = Html::parse_fragment(html_content);
    let text_content = document.root_element().text().collect::<Vec<_>>().join(" ");
    text_content
        .split_whitespace()
        .collect::<Vec<&str>>()
        .join(" ")
}

fn extract_image_url(item: &rss::Item) -> Option<String> {
    if let Some(enclosure) = item.enclosure() {
        if enclosure.mime_type().starts_with("image/") {
            return Some(enclosure.url().to_string());
        }
    }
    let content_to_search = item.description().or_else(|| item.content()).unwrap_or("");
    if content_to_search.is_empty() {
        return None;
    }
    match regex::Regex::new(r#"<img[^>]+src=["']([^"']+)["']"#) {
        Ok(re) => {
            if let Some(cap) = re.captures(content_to_search) {
                if let Some(url_match) = cap.get(1) {
                    return Some(url_match.as_str().to_string());
                }
            }
        }
        Err(e) => {
            log::error!("Regex compilation error in extract_image_url: {}", e);
        }
    }
    None
}