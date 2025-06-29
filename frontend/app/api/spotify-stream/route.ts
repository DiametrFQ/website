import { NextRequest } from 'next/server';
import http from 'http';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const backendUrl = process.env.RUST_BACKEND_URL || 'http://localhost:8080';
  
  const url = new URL(backendUrl);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: '/api/spotify/now_playing_stream',
    method: 'GET',
    headers: {
      'Accept': 'text/event-stream',
      'Connection': 'keep-alive',
    },
  };

  const stream = new ReadableStream({
    start(controller) {
      const backendRequest = http.get(options, (backendResponse) => {
        backendResponse.on('data', (chunk) => {
          controller.enqueue(chunk);
        });

        backendResponse.on('end', () => {
          console.log('Backend stream ended.');
          controller.close();
        });

        backendResponse.on('error', (err) => {
            console.error('Error in backend response stream:', err);
            controller.error(err);
        });
      });

      backendRequest.on('error', (err) => {
        console.error('Error making request to backend:', err);
        controller.error(err);
      });
      
      request.signal.addEventListener('abort', () => {
        console.log('Client aborted request. Destroying backend request.');
        backendRequest.destroy();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}