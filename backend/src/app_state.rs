use crate::spotify::services::SpotifyService;
use crate::telegram::services::{RealRssFetcher, RssFetcher};
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct AppState {
    pub spotify_service: Mutex<SpotifyService>,
    pub rss_fetcher: Arc<dyn RssFetcher + Send + Sync>,
}

impl AppState {
    pub fn new(spotify_service: SpotifyService) -> Self {
        Self {
            spotify_service: Mutex::new(spotify_service),
            rss_fetcher: Arc::new(RealRssFetcher),
        }
    }
}
