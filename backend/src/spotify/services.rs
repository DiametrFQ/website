use crate::errors::{AppResult, AppError};
use super::models::{TokenResponse, CurrentlyPlayingResponse, NowPlaying};
use std::env;
use actix_web::web;
use base64::{Engine as _, engine::general_purpose};
use std::sync::Mutex;
use std::time::{Instant, Duration};
use async_stream::stream;
use tokio::time;
use serde_json;

type TokenCache = Mutex<Option<(String, Instant)>>;

async fn get_access_token(cache: &TokenCache) -> AppResult<String> {
    let mut cached_token = cache.lock().unwrap();

    if let Some((token, expiry)) = cached_token.as_ref() {
        if *expiry > Instant::now() {
            log::info!("Using cached Spotify token.");
            return Ok(token.clone());
        }
    }

    log::info!("Requesting new Spotify token.");
    let client_id = env::var("SPOTIFY_CLIENT_ID").map_err(|_| AppError::InternalError("SPOTIFY_CLIENT_ID not set".to_string()))?;
    let client_secret = env::var("SPOTIFY_CLIENT_SECRET").map_err(|_| AppError::InternalError("SPOTIFY_CLIENT_SECRET not set".to_string()))?;
    let refresh_token = env::var("SPOTIFY_REFRESH_TOKEN").map_err(|_| AppError::InternalError("SPOTIFY_REFRESH_TOKEN not set".to_string()))?;

    let client = reqwest::Client::new();
    let auth_header = format!("Basic {}", general_purpose::STANDARD.encode(format!("{}:{}", client_id, client_secret)));

    let params = [
        ("grant_type", "refresh_token"),
        ("refresh_token", &refresh_token),
    ];

    let response = client.post("https://accounts.spotify.com/api/token")
        .header("Authorization", auth_header)
        .form(&params)
        .send()
        .await?
        .json::<TokenResponse>()
        .await?;

    let expires_in = Duration::from_secs(response.expires_in.saturating_sub(60));
    let new_expiry = Instant::now() + expires_in;
    let new_token = response.access_token;
    
    *cached_token = Some((new_token.clone(), new_expiry));
    
    Ok(new_token)
}

pub async fn get_now_playing(token_cache: &TokenCache) -> AppResult<NowPlaying> {
    let access_token = get_access_token(token_cache).await?; // Используем кэширующую функцию
    let client = reqwest::Client::new();

    let response = client.get("https://api.spotify.com/v1/me/player/currently-playing")
        .bearer_auth(access_token)
        .send()
        .await;

    match response {
        Ok(res) => {
            if res.status() == 204 {
                return Ok(NowPlaying {
                    is_playing: false, title: None, artist: None, album_image_url: None, song_url: None,
                });
            }
            
            let data = res.json::<CurrentlyPlayingResponse>().await?;
            if !data.is_playing || data.item.is_none() {
                return Ok(NowPlaying {
                    is_playing: false, title: None, artist: None, album_image_url: None, song_url: None,
                });
            }

            let item = data.item.unwrap();
            let artists = item.artists.into_iter().map(|a| a.name).collect::<Vec<String>>().join(", ");
            let album_image_url = item.album.images.first().map(|i| i.url.clone());
            
            Ok(NowPlaying {
                is_playing: true,
                title: Some(item.name),
                artist: Some(artists),
                album_image_url,
                song_url: Some(item.external_urls.spotify),
            })
        }
        Err(e) => {
            log::error!("Failed to get currently playing from Spotify: {}", e);
            Err(AppError::RequestError(e))
        }
    }
}

pub fn now_playing_stream(token_cache: web::Data<TokenCache>) -> impl futures_util::Stream<Item = AppResult<String>> {
    let cache_for_stream = Mutex::new(token_cache.lock().unwrap().clone());
    
    stream! {
        let mut last_song_id: Option<String> = None;

        loop {
            time::sleep(Duration::from_secs(5)).await;

            match get_now_playing(&cache_for_stream).await {
                Ok(now_playing) => {
                    let current_song_id = if now_playing.is_playing {
                        now_playing.song_url.clone()
                    } else {
                        None
                    };

                    if current_song_id != last_song_id {
                        last_song_id = current_song_id;
                        match serde_json::to_string(&now_playing) {
                            Ok(json_string) => yield Ok(json_string),
                            Err(e) => yield Err(AppError::InternalError(format!("Serialization failed: {}", e))),
                        }
                    }
                }
                Err(e) => {
                    log::error!("Error fetching now playing in stream: {:?}", e);
                }
            }
        }
    }
}