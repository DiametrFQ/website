import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const backendUrl = (process.env.RUST_BACKEND_URL || 'http://localhost:8080') + '/api/spotify/now_playing_stream';

  try {
    const backendResponse = await fetch(backendUrl, {
      signal: request.signal,
      headers: {
        'Accept': 'text/event-stream',
      },
    });

    if (!backendResponse.ok) {
      return new Response(backendResponse.body, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
      });
    }

    return new Response(backendResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Stream request aborted by client.');
      return new Response('Stream aborted', { status: 499 });
    }
    console.error('Error proxying spotify stream:', error);
    return new Response('Failed to proxy stream', { status: 500 });
  }
}