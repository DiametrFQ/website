import { NextResponse } from 'next/server';
import { requestToBackend, HttpError } from '@/lib/api';

// Тип данных, который мы ожидаем от нашего Rust бэкенда
interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export const revalidate = 0; // Запрещаем кеширование этого роута

export async function GET() {
  try {
    const data = await requestToBackend<NowPlayingData>('/api/spotify/now-playing', 'GET');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/spotify proxy:', error);
    if (error instanceof HttpError) {
      return NextResponse.json(
        { error: 'Ошибка при запросе к бэкенду', details: error.data }, 
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера Next.js' }, 
      { status: 500 }
    );
  }
}