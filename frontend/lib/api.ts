export class HttpError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any, message?: string) {
    super(message || `Request failed with status ${status}`);
    this.name = 'HttpError';
    this.status = status;
    this.data = data; // Тело ответа с ошибкой от бэкенда
  }
}

const BACKEND_URL = process.env.RUST_BACKEND_URL || 'http://localhost:8080';
console.log('BACKEND_URL', BACKEND_URL);

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  headers?: HeadersInit;
  body?: BodyInit | Record<string, any>;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

/**
 * Улучшенный и надежный билдер запросов к бэкенду.
 * @template T - Ожидаемый тип данных в успешном ответе.
 * @param endpoint - Путь к API (например, '/api/telegram').
 * @param method - HTTP-метод.
 * @param options - Объект с дополнительными параметрами: headers, body, next (для кеша).
 * @returns - Промис с данными типа T.
 * @throws {HttpError} - В случае ошибки сети или статуса ответа, не равного 2xx.
 */
export const requestToBackend = async <T = unknown>(
  endpoint: string,
  method: HttpMethod,
  options: RequestOptions = {}
): Promise<T> => {
  const url = new URL(endpoint, BACKEND_URL);

  const config: RequestInit = {
    method,
    next: options.next, 
  };
  
  const headers = new Headers(options.headers);

  if (options.body && method !== 'GET') {
    if (typeof options.body === 'object' && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    } else {
      config.body = options.body as BodyInit;
    }
  }

  config.headers = headers;

  try {
    const response = await fetch(url.toString(), config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Backend returned non-JSON error response' }));
      throw new HttpError(response.status, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }
    
    return response.json();

  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    console.error('Network or fetch error:', error);
    throw new Error('Network error or failed to fetch');
  }
};