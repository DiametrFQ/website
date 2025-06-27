import { HttpError } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const backendUrl = process.env.RUST_BACKEND_URL || 'http://localhost:8080';

  const streamUrl = new URL('/api/spotify/now_playing_stream', backendUrl);

  try {
    const backendResponse = await fetch(streamUrl, {
      headers: { 'Accept': 'text/event-stream' },
      cache: 'no-store',
      signal: request.signal,
    });
    
    if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        throw new HttpError(backendResponse.status, errorText);
    }

    const stream = new ReadableStream({
      async start(controller) {
        if (!backendResponse.body) {
            controller.close();
            return;
        }
        const reader = backendResponse.body.getReader();
        let isClosed = false;
        const cleanup = () => {
            if (isClosed) return;
            isClosed = true;
            try { reader.releaseLock(); } catch {}
            controller.close();
        };
        request.signal.addEventListener('abort', cleanup);
        
        try {
          while (!isClosed) {
            const { done, value } = await reader.read();
            if (done || isClosed) break;
            if (!isClosed) controller.enqueue(value);
          }
        } catch (error) {
          if (!isClosed) controller.error(error);
        } finally {
          cleanup();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response('Stream aborted', { status: 499 });
    }

    console.error('Error proxying spotify stream:', error);
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: 'Failed to connect to backend stream', details: message }), { status });
  }
}