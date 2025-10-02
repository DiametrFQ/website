export interface NowPlayingResponse {
  item: Item | null;
  is_playing: boolean;
}

export interface Item {
  name: string;
  artists: Artist[];
  album: Album;
  external_urls: ExternalUrls;
}

export interface Artist {
  name: string;
}

export interface Album {
  images: Image[];
}

export interface Image {
  url: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface TokenResponse {
  access_token: string;
}

export interface NowPlayingStreamData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}