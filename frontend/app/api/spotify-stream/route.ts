import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Оставляем, это важно для стриминга

export async function GET(request: NextRequest) {
  // Собираем URL к нашему Rust бэкенду
  const backendUrl = (process.env.RUST_BACKEND_URL || 'http://localhost:8080') + '/api/spotify/now_playing_stream';

  try {
    // Делаем запрос к бэкенду с помощью fetch
    const backendResponse = await fetch(backendUrl, {
      // Важно: передаем сигнал AbortController, чтобы если браузер закроет соединение,
      // мы могли бы прервать и запрос к бэкенду.
      signal: request.signal,
      headers: {
        'Accept': 'text/event-stream',
      },
    });

    // Если бэкенд ответил ошибкой, перенаправляем ее браузеру
    if (!backendResponse.ok) {
      return new Response(backendResponse.body, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
      });
    }

    // Это ключевой момент. backendResponse.body - это уже готовый ReadableStream.
    // Мы создаем новый Response для браузера и просто "перекачиваем" поток из бэкенда напрямую.
    return new Response(backendResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    // Ловим ошибки сети, например, если бэкенд недоступен
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Stream request aborted by client.');
      return new Response('Stream aborted', { status: 499 });
    }
    console.error('Error proxying spotify stream:', error);
    return new Response('Failed to proxy stream', { status: 500 });
  }
}