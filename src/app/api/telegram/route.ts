import { NextResponse } from 'next/server.js';
import Parser from 'rss-parser';

// Определяем типы данных для постов
interface Post {
  title: string;
  link: string;
  contentSnippet: string;
  imageUrl?: string;
}

export async function GET() {
  const rssParser = new Parser();
  const channel = 'diametrpd'; // Замените на название своего канала
  const feedUrl = `https://rsshub.app/telegram/channel/${channel}`;

  try {
    const feed = await rssParser.parseURL(feedUrl);
    const posts: Post[] = feed.items.map((item) => {
      const imageUrl = (item.enclosure ? item.enclosure.url : null) || (item.content ? item.content.match(/<img[^>]+src="([^">]+)"/)?.[1] : null);
      return {
      title: item.title || 'Без заголовка',
      link: item.link || '#',
      contentSnippet: item.contentSnippet || '',
      imageUrl: imageUrl || ''
      };
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка загрузки RSS' + error });
  }
}