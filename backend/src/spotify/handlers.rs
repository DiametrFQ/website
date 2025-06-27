use crate::spotify::{ models::{NowPlayingResponse, NowPlayingStreamData}, services::SpotifyService};
use actix_web::{web, Error, HttpResponse, Responder};
use log::{error, info, warn};
use tokio::time::interval;
use serde_json;
use std::{sync::Mutex, time::Duration}; 
use tokio_stream::{wrappers::IntervalStream, StreamExt};

pub async fn get_now_playing_handler(
    spotify_service: web::Data<Mutex<SpotifyService>>,
) -> impl Responder {
    let mut service = spotify_service.lock().unwrap();
    match service.fetch_now_playing().await {
        Ok(Some(data)) => HttpResponse::Ok().json(data),
        Ok(None) => HttpResponse::NoContent().finish(),
        Err(e) => {
            error!("Error in get_now_playing handler: {}", e);
            HttpResponse::InternalServerError().body("Error fetching data from Spotify")
        }
    }
}

pub async fn now_playing_stream_handler(
    spotify_service: web::Data<Mutex<SpotifyService>>,
) -> impl Responder {
    let stream = async_stream::stream! {
        let interval = interval(Duration::from_secs(3));
        let mut interval_stream = IntervalStream::new(interval);

        while let Some(_) = interval_stream.next().await {
            let spotify_data = spotify_service.clone();

            let mut service = match spotify_data.lock() {
                Ok(guard) => guard,
                Err(poisoned) => {
                    warn!("Mutex for streaming was poisoned: {}. Skipping tick.", poisoned);
                    continue;
                }
            };

            // Получаем данные и СРАЗУ ЖЕ ПРЕОБРАЗУЕМ их в нужный формат
            let stream_data = match service.fetch_now_playing().await {
                Ok(Some(response)) => {
                    info!("Streaming data: {}", response.item.as_ref().map_or("Not Playing", |i| &i.name));
                    // ВЫЗЫВАЕМ ФУНКЦИЮ-ТРАНСФОРМЕР
                    transform_to_stream_data(response)
                },
                Ok(None) => {
                    info!("Streaming data: Not Playing");
                    // Создаем пустой объект, если ничего не играет
                    NowPlayingStreamData {
                        is_playing: false,
                        title: None, artist: None, album_image_url: None, song_url: None
                    }
                },
                Err(e) => {
                    error!("Error fetching for stream: {}", e);
                    // Пропускаем итерацию в случае ошибки, чтобы стрим не падал
                    continue;
                }
            };

            // Сериализуем уже ПРАВИЛЬНУЮ структуру
            let json_string = match serde_json::to_string(&stream_data) {
                Ok(s) => s,
                Err(e) => {
                    error!("Stream serialization error: {}", e);
                    continue;
                }
            };
            let sse_formatted_data = format!("data: {}\n\n", json_string);

            yield Ok::<_, Error>(actix_web::web::Bytes::from(sse_formatted_data));
        }
        info!("Client disconnected from SSE stream.");
    };

    HttpResponse::Ok()
        .content_type("text/event-stream")
        .insert_header(("Cache-Control", "no-cache"))
        .streaming(stream)
}

// Эта функция теперь будет использоваться
fn transform_to_stream_data(response: NowPlayingResponse) -> NowPlayingStreamData {
    if let Some(item) = response.item {
        let artist_names = item
            .artists
            .into_iter()
            .map(|a| a.name)
            .collect::<Vec<String>>()
            .join(", ");

        NowPlayingStreamData {
            is_playing: response.is_playing,
            title: Some(item.name),
            artist: Some(artist_names),
            album_image_url: item.album.images.first().map(|i| i.url.clone()),
            song_url: Some(item.external_urls.spotify),
        }
    } else {
        NowPlayingStreamData {
            is_playing: response.is_playing, // is_playing может быть true, даже если item == None (например, реклама)
            title: None,
            artist: None,
            album_image_url: None,
            song_url: None,
        }
    }
}