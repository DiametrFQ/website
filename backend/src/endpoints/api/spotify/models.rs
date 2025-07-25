use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct NowPlayingResponse {
    pub item: Option<Item>,
    pub is_playing: bool,
    pub device: Option<Device>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Item {
    pub name: String,
    pub artists: Vec<Artist>,
    pub album: Album,
    pub external_urls: ExternalUrls,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Artist {
    pub name: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Album {
    pub images: Vec<Image>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Image {
    pub url: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ExternalUrls {
    pub spotify: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Device {
    pub volume_percent: Option<u32>,
}


#[derive(Debug, Deserialize)]
pub struct TokenResponse {
    pub access_token: String,
}

#[derive(Debug, Deserialize)]
pub struct SpotifyErrorResponse {
    pub error: String,
    pub error_description: String,
}

#[derive(Serialize, Debug, Clone)]
pub struct NowPlayingStreamData {
    #[serde(rename = "isPlaying")]
    pub is_playing: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub artist: Option<String>,

    #[serde(rename = "albumImageUrl")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub album_image_url: Option<String>,

    #[serde(rename = "songUrl")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub song_url: Option<String>,
}