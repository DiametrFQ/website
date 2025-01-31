'use client';
import { useEffect, useState } from 'react';
import PostList from './PostList';

// Описание типа для постов
interface Post {
  title: string;
  link: string;
  contentSnippet: string;
  imageUrl?: string;
}

const TelegramPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/telegram')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error('Ошибка загрузки:', err));
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Последние посты из Telegram</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post, index) => (
          <PostList key={index} posts={[post]} />
        ))}
      </ul>
    </div>
  );
};

export default TelegramPosts;
