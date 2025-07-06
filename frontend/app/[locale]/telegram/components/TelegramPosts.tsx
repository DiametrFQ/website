'use client';
import { useEffect, useState } from 'react';
import PostList from './PostList';
import styles from '../styles/page.module.css';

interface Post {
  title: string;
  link: string;
  contentSnippet: string;
  imageUrl?: string;
}

const TelegramPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/telegram')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки:', err);
        setError('Не удалось загрузить посты.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Загрузка постов...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>Последние посты из Telegram</h2>
      {posts.length > 0 ? (
         <PostList posts={posts} />
      ) : (
        <p>Постов пока нет.</p>
      )}
    </div>
  );
};

export default TelegramPosts;