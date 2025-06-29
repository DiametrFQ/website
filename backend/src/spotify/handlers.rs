use crate::spotify::{ models::{NowPlayingResponse, NowPlayingStreamData}, services::SpotifyService};
use actix_web::{web, Error, HttpResponse, Responder};
use log::{error, info};
use tokio::time::interval;
use serde_json;
use std::time::Duration;
use tokio::sync::{mpsc, Mutex};
use tokio_stream::wrappers::ReceiverStream; 
use futures_util::stream::StreamExt;

pub async fn get_now_playing_handler(
    spotify_service: web::Data<Mutex<SpotifyService>>,
) -> impl Responder {
    let mut service = spotify_service.lock().await;

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
    let (tx, rx) = mpsc::channel::<String>(10);

    tokio::spawn(async move {
        let mut tick_interval = interval(Duration::from_secs(3));

        loop {
            tokio::select! {
                _ = tick_interval.tick() => {
                    let spotify_data = spotify_service.clone();
                    let mut service = spotify_data.lock().await;

                    let stream_data = match service.fetch_now_playing().await {
                        Ok(Some(response)) => {
                            info!("Streaming data: {}", response.item.as_ref().map_or("Not Playing", |i| &i.name));
                            transform_to_stream_data(response)
                        },
                        Ok(None) => {
                            info!("Streaming data: Not Playing");
                            NowPlayingStreamData {
                                is_playing: false,
                                title: None, artist: None, album_image_url: None, song_url: None
                            }
                        },
                        Err(e) => {
                            error!("Error fetching for stream: {}", e);
                            continue;
                        }
                    };

                    let json_string = match serde_json::to_string(&stream_data) {
                        Ok(s) => s,
                        Err(e) => {
                            error!("Stream serialization error: {}", e);
                            continue;
                        }
                    };

                    if tx.send(json_string).await.is_err() {
                        info!("Client disconnected. Stopping stream task.");
                        break;
                    }
                }

                _ = tx.closed() => {
                    info!("Stream channel closed by receiver. Stopping task.");
                    break;
                }
            }
        }
    });

    let receiver_stream = ReceiverStream::new(rx);

    let sse_stream = receiver_stream.map(|json_string| {
        let sse_formatted_data = format!("data: {}\n\n", json_string);
        Ok::<_, Error>(actix_web::web::Bytes::from(sse_formatted_data))
    });

    HttpResponse::Ok()
        .content_type("text/event-stream")
        .insert_header(("Cache-Control", "no-cache"))
        .insert_header(("Connection", "keep-alive"))
        .streaming(sse_stream)
}

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
            is_playing: response.is_playing,
            title: None,
            artist: None,
            album_image_url: None,
            song_url: None,
        }
    }
}