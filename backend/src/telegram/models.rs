use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)] // <--- Serialize есть!
pub struct Post {
    pub title: String,
    pub link: String,
    #[serde(rename = "contentSnippet")]
    pub content_snippet: String,
    #[serde(rename = "imageUrl", skip_serializing_if = "Option::is_none")]
    pub image_url: Option<String>,
}