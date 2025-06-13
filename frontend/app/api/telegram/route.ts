import { NextResponse } from 'next/server';

import { requestToBackend, HttpError } from '@/lib/api';

interface Post {
  title: string;
  link: string;
  contentSnippet: string;
  imageUrl?: string;
}

export async function GET() {
  try {
    const posts = await requestToBackend<Post[]>('/api/telegram', 'GET', {
      next: { revalidate: 600 } 
    });

    return NextResponse.json(posts);

  } catch (error) {
    console.error('Error in GET /api/telegram:', error);

    if (error instanceof HttpError) {
      return NextResponse.json(
        { error: 'Ошибка при запросе к Rust бэкенду', details: error.data }, 
        { status: error.status }
      );
    }

    return NextResponse.json(
        { error: 'Внутренняя ошибка сервера' }, 
        { status: 500 }
    );
  }
}