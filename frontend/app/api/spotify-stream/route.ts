import { HttpError } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) { // Добавим request, чтобы отслеживать отключение
  const backendUrl = process.env.RUST_BACKEND_URL || 'http://localhost:8080';
  const streamUrl = `${backendUrl}/api/spotify/now-playing-stream`;

  try {
    const backendResponse = await fetch(streamUrl, {
      headers: {
        'Accept': 'text/event-stream',
      },
      cache: 'no-store',
      // signal важен для отмены fetch, если клиент отключается
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
        // Флаг, который говорит нам, что стрим был принудительно закрыт
        let isClosed = false;

        // Функция для аккуратного закрытия
        const cleanup = () => {
            if (isClosed) return;
            isClosed = true;
            reader.releaseLock();
            controller.close();
            console.log("Stream to client closed.");
        };

        // Если клиент отключается (например, уходит со страницы)
        request.signal.addEventListener('abort', cleanup);
        
        try {
          while (!isClosed) {
            const { done, value } = await reader.read();
            
            // Если стрим с бэкенда закончился или клиент отключился
            if (done || isClosed) {
              break;
            }
            
            // Дополнительная проверка перед записью
            if (!isClosed) {
               controller.enqueue(value);
            }
          }
        } catch (error) {
          // Эта ошибка может возникнуть, если сам fetch был отменен
          console.error('Error while reading stream from backend:', error);
          if (!isClosed) {
            controller.error(error);
          }
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
      console.log('Stream request aborted by client.');
      return new Response('Stream aborted', { status: 499 }); // 499 Client Closed Request
    }

    console.error('Error proxying spotify stream:', error);
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: 'Failed to connect to backend stream', details: message }), { status });
  }
}