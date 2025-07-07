use super::models::{NowPlayingResponse, SpotifyErrorResponse, TokenResponse};
use super::errors::{AppError, AppResult};
use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64_STANDARD};
use log::{error, info, warn};
use reqwest::StatusCode;
use std::env;

#[derive(Clone)]
pub struct SpotifyService {
    client_id: String,
    client_secret: String,
    refresh_token: String,
    access_token: Option<String>,
}

impl SpotifyService {
    pub fn new() -> Self {
        Self {
            client_id: env::var("SPOTIFY_CLIENT_ID").expect("SPOTIFY_CLIENT_ID must be set"),
            client_secret: env::var("SPOTIFY_CLIENT_SECRET").expect("SPOTIFY_CLIENT_SECRET must be set"),
            refresh_token: env::var("SPOTIFY_REFRESH_TOKEN").expect("SPOTIFY_REFRESH_TOKEN must be set"),
            access_token: None,
        }
    }

    pub async fn fetch_now_playing(&mut self) -> AppResult<Option<NowPlayingResponse>> {
        for attempt in 1..=2 {
            if self.access_token.is_none() {
                self.refresh_token_logic().await?;
            }

            let access_token = self
                .access_token
                .as_ref()
                .ok_or_else(|| AppError::InternalError("Failed to get access token".to_string()))?;

            let client = reqwest::Client::new();
            let response = client
                .get("https://api.spotify.com/v1/me/player/currently-playing")
                .header("Authorization", format!("Bearer {}", access_token))
                .send()
                .await
                .map_err(AppError::from)?;

            let status = response.status();

            match status {
                StatusCode::OK => {
                    let now_playing_response = response.json::<NowPlayingResponse>().await?;
                    return Ok(Some(now_playing_response));
                }
                StatusCode::NO_CONTENT => {
                    return Ok(None);
                }
                StatusCode::UNAUTHORIZED => {
                    warn!(
                        "Spotify token unauthorized. Attempting refresh (attempt {}/2)",
                        attempt
                    );
                    self.access_token = None;
                    continue;
                }
                _ => {
                    let error_text = response.text().await?;
                    return Err(AppError::InternalError(format!(
                        "Spotify API error: {} - {}",
                        status, error_text
                    )));
                }
            }
        }

        Err(AppError::InternalError(
            "Failed to fetch now playing after 2 attempts.".to_string(),
        ))
    }

    async fn refresh_token_logic(&mut self) -> AppResult<()> {
        info!("Requesting a new Spotify token.");

        let mut params = std::collections::HashMap::new();
        params.insert("grant_type", "refresh_token");
        params.insert("refresh_token", &self.refresh_token);

        let client = reqwest::Client::new();
        let auth_string = format!("{}:{}", self.client_id, self.client_secret);
        let encoded_auth = BASE64_STANDARD.encode(auth_string);

        let token_req_response = client
            .post("https://accounts.spotify.com/api/token")
            .header("Authorization", format!("Basic {}", encoded_auth))
            .form(&params)
            .send()
            .await?;

        let status = token_req_response.status();
        let response_text = token_req_response.text().await?;

        if status.is_success() {
            match serde_json::from_str::<TokenResponse>(&response_text) {
                Ok(token_response) => {
                    self.access_token = Some(token_response.access_token);
                    info!("Successfully refreshed Spotify token.");
                    Ok(())
                }
                Err(e) => {
                    error!(
                        "Failed to parse successful token response. Body: '{}'. Error: {}",
                        response_text, e
                    );
                    Err(AppError::InternalError(format!(
                        "JSON parsing error: {}",
                        e
                    )))
                }
            }
        } else {
            let error_message = match serde_json::from_str::<SpotifyErrorResponse>(&response_text) {
                Ok(err_resp) => format!(
                    "Spotify API Error: {} - {}",
                    err_resp.error, err_resp.error_description
                ),
                Err(_) => format!(
                    "Unknown Spotify API error. Status: {}, Body: '{}'",
                    status, response_text
                ),
            };
            error!("{}", error_message);
            Err(AppError::InternalError(error_message))
        }
    }
}
