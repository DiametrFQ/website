use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
pub struct TokenResponse {
    pub access_token: String,
    pub expires_in: u64, 
}

#[derive(Deserialize, Debug)]
pub struct Image {
    pub url: String,
}

#[derive(Deserialize, Debug)]
pub struct Album {
    pub images: Vec<Image>,
}

#[derive(Deserialize, Debug)]
pub struct Artist {
    pub name: String,
}

#[derive(Deserialize, Debug)]
pub struct TrackItem {
    pub name: String,
    pub artists: Vec<Artist>,
    pub album: Album,
    pub external_urls: ExternalUrls,
}

#[derive(Deserialize, Debug)]
pub struct ExternalUrls {
    pub spotify: String,
}


#[derive(Deserialize, Debug)]
pub struct CurrentlyPlayingResponse {
    pub is_playing: bool,
    pub item: Option<TrackItem>,
}

// Наша кастомная, упрощенная модель для отправки на фронтенд
#[derive(Serialize, Debug)]
pub struct NowPlaying {
    #[serde(rename = "isPlaying")]
    pub is_playing: bool,
    pub title: Option<String>,
    pub artist: Option<String>,
    #[serde(rename = "albumImageUrl")]
    pub album_image_url: Option<String>,
    #[serde(rename = "songUrl")]
    pub song_url: Option<String>,
}