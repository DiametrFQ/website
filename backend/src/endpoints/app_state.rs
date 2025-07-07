use crate::endpoints::api::{
    spotify::services::SpotifyService,
    telegram::services::{RealRssFetcher, RssFetcher},
};
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct AppState {
    pub spotify_service: Mutex<SpotifyService>,
    pub rss_fetcher: Arc<dyn RssFetcher + Send + Sync>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            spotify_service: Mutex::new(SpotifyService::new()),
            rss_fetcher: Arc::new(RealRssFetcher),
        }
    }
}
