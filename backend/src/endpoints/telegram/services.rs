use super::models::Post;
use crate::common::errors::{AppError, AppResult};
use async_trait::async_trait;
use bytes::Bytes;
use rss::Channel;
use scraper::Html;

const TELEGRAM_CHANNEL: &str = "diametrpd";

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

pub async fn fetch_telegram_posts(fetcher: &(dyn RssFetcher + Sync)) -> AppResult<Vec<Post>> {
    let feed_url = format!("https://rsshub.app/telegram/channel/{}", TELEGRAM_CHANNEL);
    let content = fetcher.fetch_rss_content(&feed_url).await?;

    let channel = Channel::read_from(&content[..]).map_err(|e| {
        log::error!("Failed to parse RSS feed: {}", e);
        // Если не смогли распарсить, тоже делаем fallback
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

    Ok(posts)
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

#[cfg(test)]
mod tests {
    use super::*;
    use bytes::Bytes;
    use std::io;

    // Моковая структура для тестов
    struct MockRssFetcher {
        response: AppResult<Bytes>,
    }

    #[async_trait]
    impl RssFetcher for MockRssFetcher {
        async fn fetch_rss_content(&self, _url: &str) -> AppResult<Bytes> {
            self.response
                .as_ref()
                .map(|b| b.clone())
                .map_err(|e| AppError::IoError(io::Error::new(io::ErrorKind::Other, e.to_string())))
        }
    }

    #[tokio::test]
    async fn test_fetch_posts_success_path() {
        let fake_rss = r#"
            <?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
                <channel>
                    <title>Test Channel</title>
                    <item><title>Post 1</title><link>http://a.com/1</link><description>Desc 1</description></item>
                    <item><title>Post 2</title><link>http://a.com/2</link><description><![CDATA[<p>C</p><img src="http://a.com/img.jpg">]]></description></item>
                    <item><title></title><link></link><description></description></item>
                </channel>
            </rss>
        "#;

        let mock_fetcher = MockRssFetcher {
            response: Ok(Bytes::from(fake_rss)),
        };

        let result = fetch_telegram_posts(&mock_fetcher).await;
        assert!(result.is_ok(), "Function should return Ok on valid RSS");

        let posts = result.unwrap();
        assert_eq!(posts.len(), 3, "Should parse all 3 items");

        assert_eq!(posts[0].title, "Post 1");
        assert_eq!(posts[0].content_snippet, "Desc 1");

        assert_eq!(posts[1].content_snippet, "C");
        assert_eq!(posts[1].image_url, Some("http://a.com/img.jpg".to_string()));

        assert_eq!(posts[2].title, "Без заголовка");
        assert_eq!(posts[2].link, "#");
    }

    #[tokio::test]
    async fn test_fetch_posts_on_parsing_error() {
        let fake_response = "this is not xml";
        let mock_fetcher = MockRssFetcher {
            response: Ok(Bytes::from(fake_response)),
        };

        let result = fetch_telegram_posts(&mock_fetcher).await;

        assert!(result.is_err());
        match result.unwrap_err() {
            AppError::ServiceErrorWithFallback => (), // Успех!
            other => panic!(
                "Expected ServiceErrorWithFallback on parsing error, but got {:?}",
                other
            ),
        }
    }

    #[tokio::test]
    async fn test_fetch_posts_on_network_error() {
        let mock_fetcher = MockRssFetcher {
            response: Err(AppError::InternalError(
                "Simulated network failure".to_string(),
            )),
        };

        let result = fetch_telegram_posts(&mock_fetcher).await;
        assert!(result.is_err());
    }

    #[test]
    fn test_html_to_plaintext_conversion() {
        let html = "<div> <p>Hello  <b>world</b> & friends</p>\n<span>!</span> </div>";
        assert_eq!(html_to_plaintext(html), "Hello world & friends !");
        assert_eq!(html_to_plaintext(""), "");
    }

    #[test]
    fn test_image_url_extraction() {
        // --- Тест 1: Картинка в <description> ---
        let mut item1 = rss::Item::default();
        item1.set_description(String::from(
            "<p>text</p><img src='http://test.com/image.png' />",
        ));
        let result1 = extract_image_url(&item1);
        assert!(result1.is_some(), "Test 1 failed");
        assert_eq!(result1.unwrap(), "http://test.com/image.png");

        // --- Тест 2: Картинка в <content> ---
        let mut item2 = rss::Item::default();
        item2.set_content(String::from("<img src=\"https://another.com/image.gif\">"));
        let result2 = extract_image_url(&item2);
        assert!(
            result2.is_some(),
            "Test 2 failed: Should find an image in content"
        );
        assert_eq!(result2.unwrap(), "https://another.com/image.gif");

        // --- Тест 3: Картинка из <enclosure> (имеет приоритет) ---
        let mut item3 = rss::Item::default();
        item3.set_content(String::from("<img src=\"ignored.png\">")); // Картинка для игнорирования
        let mut enclosure = rss::Enclosure::default();
        enclosure.set_url("http://priority.com/enclosure.jpg".to_string());
        enclosure.set_mime_type("image/jpeg".to_string());
        item3.set_enclosure(enclosure);
        let result3 = extract_image_url(&item3);
        assert!(result3.is_some(), "Test 3 failed");
        assert_eq!(
            result3.unwrap(),
            "http://priority.com/enclosure.jpg",
            "Enclosure should have priority"
        );

        // --- Тест 4: Нет картинки ---
        let item_no_image = rss::Item::default();
        assert!(extract_image_url(&item_no_image).is_none(), "Test 4 failed");
    }
}
