// backend/src/spotify/services.rs

use super::models::{NowPlayingResponse, SpotifyErrorResponse, TokenResponse};
use base64::{engine::general_purpose::STANDARD as BASE64_STANDARD, Engine as _};
use log::{error, info, warn};
use reqwest::StatusCode;

#[derive(Clone)]
pub struct SpotifyService {
    client_id: String,
    client_secret: String,
    refresh_token: String,
    access_token: Option<String>,
}

impl SpotifyService {
    pub fn new(client_id: String, client_secret: String, refresh_token: String) -> Self {
        Self {
            client_id,
            client_secret,
            refresh_token,
            access_token: None,
        }
    }

    // Возвращаемся к простому `async fn`!
    pub async fn fetch_now_playing(
        &mut self,
    ) -> Result<Option<NowPlayingResponse>, Box<dyn std::error::Error>> {
        // Убираем рекурсию, заменяем ее циклом с одной попыткой повтора
        for attempt in 1..=2 {
            if self.access_token.is_none() {
                // Если токена нет, получаем его. Если не получилось - выходим с ошибкой.
                self.refresh_token_logic().await?;
            }

            let access_token = match self.access_token.as_ref() {
                Some(token) => token,
                None => {
                    // Эта ветка не должна выполниться, если `?` выше работает,
                    // но это защищает нас от паники.
                    return Err("Failed to obtain access token before making request.".into());
                }
            };

            let client = reqwest::Client::new();
            let response = client
                .get("https://api.spotify.com/v1/me/player/currently-playing")
                .header("Authorization", format!("Bearer {}", access_token))
                .send()
                .await?;

            let status = response.status();

            match status {
                StatusCode::OK => {
                    // Все хорошо, парсим и выходим из цикла
                    let now_playing_response = response.json::<NowPlayingResponse>().await?;
                    return Ok(Some(now_playing_response));
                }
                StatusCode::NO_CONTENT => {
                    // Ничего не играет, выходим из цикла
                    return Ok(None);
                }
                StatusCode::UNAUTHORIZED => {
                    // Токен протух. На второй итерации цикла он обновится.
                    warn!("Spotify token unauthorized. Attempting refresh (attempt {}/2)", attempt);
                    self.access_token = None; // Сбрасываем токен, чтобы он точно обновился
                    continue; // Переходим к следующей итерации цикла
                }
                _ => {
                    // Любая другая ошибка - выходим
                    let error_text = response.text().await?;
                    return Err(format!("Spotify API error: {} - {}", status, error_text).into());
                }
            }
        }

        // Если мы здесь, значит, обе попытки не удались
        Err("Failed to fetch now playing after 2 attempts.".into())
    }

    async fn refresh_token_logic(&mut self) -> Result<(), Box<dyn std::error::Error>> {
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
                    error!("Failed to parse successful token response. Body: '{}'. Error: {}", response_text, e);
                    Err(e.into())
                }
            }
        } else {
            let error_message = match serde_json::from_str::<SpotifyErrorResponse>(&response_text) {
                Ok(err_resp) => format!("Spotify API Error: {} - {}", err_resp.error, err_resp.error_description),
                Err(_) => format!("Unknown Spotify API error. Status: {}, Body: '{}'", status, response_text),
            };
            error!("{}", error_message);
            Err(error_message.into())
        }
    }
}