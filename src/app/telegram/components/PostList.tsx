import React from 'react';
import styles from '../styles/page.module.css';

interface Post {
  title: string;
  link: string;
  contentSnippet: string;
  imageUrl?: string;
}

const PostItem: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className={styles['post-card']}>
      {post.imageUrl && (
        <div className={styles['post-image']}>
          <img src={post.imageUrl} alt={post.title} />
        </div>
      )}
      <h3 className={styles['post-title']}>
        <a href={post.link} target="_blank" rel="noopener noreferrer">
          {post.title}
        </a>
      </h3>
      <p className={styles['post-snippet']}>{post.contentSnippet}</p>
    </div>
  );
};

const PostList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <div className={styles['post-list']}>
      {posts.map((post, index) => (
        <PostItem key={index} post={post} />
      ))}
    </div>
  );
};

export default PostList;
