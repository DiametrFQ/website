use serde::{Deserialize, Serialize};
use std::time::Instant;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Post {
    pub title: String,
    pub link: String,
    #[serde(rename = "contentSnippet")]
    pub content_snippet: String,
    #[serde(rename = "imageUrl", skip_serializing_if = "Option::is_none")]
    pub image_url: Option<String>,
}

#[derive(Debug, Clone)]
pub struct TelegramCache {
    pub posts: Vec<Post>,
    pub last_updated: Instant,
}