'use client';

import { useEffect, useState } from 'react';
import PostList from './PostList';
import styles from '../styles/page.module.css';
import { Skeleton } from '@/components/ui/skeleton';

interface Post {
  title: string;
  link: string;
  contentSnippet: string;
  imageUrl?: string;
}

const PostSkeleton = () => {
  return (
    <div className={styles['post-card']}>
      <div className={styles['post-image']}>
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      
      <div className={styles['post-content']}>
        <Skeleton className="h-6 w-3/4 mb-4 rounded-md" />
        
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-11/12 rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
      </div>
    </div>
  );
};

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
      })
      .catch((err) => {
        console.error('Ошибка загрузки:', err);
        setError('Не удалось загрузить посты.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div>
      <h2 className={styles.pageTitle}>Последние посты из Telegram</h2>
      
      {loading ? (
        <div className={styles['post-list']}>
          {[...Array(3)].map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      ) : posts.length > 0 ? (
         <PostList posts={posts} />
      ) : (
        <p className="text-muted-foreground">Постов пока нет.</p>
      )}
    </div>
  );
};

export default TelegramPosts;