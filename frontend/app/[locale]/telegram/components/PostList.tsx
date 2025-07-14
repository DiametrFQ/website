'use client';

import React from 'react';
import styles from '../styles/page.module.css';
import Image from 'next/image';

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
          {/* CHANGED: Removed dark:invert to prevent color inversion on photos */}
          <Image src={post.imageUrl} alt={post.title} width={300} height={300} style={{ objectFit: 'cover' }}/>
        </div>
      )}
      <div className={styles['post-content']}>
        <h3 className={styles['post-title']}>
          <a href={post.link} target="_blank" rel="noopener noreferrer">
            {post.title}
          </a>
        </h3>
        <p className={styles['post-snippet']}>{post.contentSnippet}</p>
      </div>
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