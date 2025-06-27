'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Marquee from "react-fast-marquee";
import styles from './NowPlaying.module.css';

const SpotifyIcon = () => (
  <svg role="img" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.43 17.118c-.24.397-.75.516-1.146.276-3.3-2.02-7.436-2.48-11.12-1.353-.456.138-.93-.15-.99-.604-.06-.456.228-1.015.684-.956 4.114-1.253 8.718-.738 12.39 1.48.396.24.516.75.276 1.146v.01zM18.8 13.9c-.3.48-.9.63-1.38.33C14.12 12.21 8.76 11.64 5.28 12.83c-.54.18-1.11-.15-1.29-.69-.18-.54.15-1.11.69-1.29 4.02-1.354 9.93-.72 13.89 1.5.48.27.63.9.33 1.38v-.01zm.18-3.264C14.774 8.27 7.994 8.04 4.76 9.157c-.6.21-1.26-.21-1.47-.81-.21-.6.21-1.26.81-1.47C8.16 5.62 15.66 5.877 19.98 8.52c.57.33.78.99.45 1.56-.33.57-.99.78-1.56.45v-.02z"/>
  </svg>
);

const ChevronIcon = ({ isHidden }: { isHidden: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${styles.chevron} ${isHidden ? styles.chevronHidden : ''}`}>
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

const SpotifyWidget = () => {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [isHidden, setIsHidden] = useState(false);
  
  useEffect(() => {
    const eventSource = new EventSource('/api/spotify-stream');

    eventSource.onopen = () => {
      setStatus('connected');
    };
    eventSource.onmessage = (event) => {
      try {
        setData(JSON.parse(event.data));
      } catch (e) {
        console.error('Failed to parse event data:', e);
      }
    };
    eventSource.onerror = (err) =>  {
      console.error('SpotifyWidget: Stream error.', err);
      setStatus('error');
      // Не нужно вызывать setLoading(true), это мешает.
      // Вместо этого можно закрыть источник, чтобы браузер не пытался переподключиться.
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const titleRef = useRef<HTMLParagraphElement>(null);
  const [isMarquee, setIsMarquee] = useState(false);
  useEffect(() => {
    if (titleRef.current) {
       setIsMarquee(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  }, [data?.title]);


   return (
    <div className={styles.widgetContainer}> 
      <div className={`${styles.widgetAnimator} ${isHidden ? styles.hidden : ''}`}>
        <div className={styles.widgetContent}>
          {status === 'loading' && (
            <div className={styles.notPlaying}>
              <SpotifyIcon />
              <span>Connecting...</span>
            </div>
          )}
          {status === 'error' && (
            <div className={styles.notPlaying}>
              <SpotifyIcon />
              <span>Connection Error</span>
            </div>
          )}
          {status === 'connected' && (!data || !data.isPlaying) && (
            <div className={styles.notPlaying}>
              <SpotifyIcon />
              <span>Not Listening</span>
            </div>
          )}
          {status === 'connected' && data && data.isPlaying && (
            <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className={styles.playingLink}>
              {data.albumImageUrl && (
                <Image
                  src={data.albumImageUrl}
                  alt={data.title || 'Album Art'}
                  width={66}
                  height={66}
                  className={styles.albumArt}
                  unoptimized
                />
              )}
              <div className={styles.trackInfo}>
                <div className={styles.titleContainer}>
                  {isMarquee ? (
                    <Marquee gradient={false} speed={25} play={true}>
                      <p className={styles.title} ref={titleRef}>
                        {data.title}
                      </p>
                    </Marquee>
                  ) : (
                    <p className={styles.title} ref={titleRef}>{data.title}</p>
                  )}
                </div>
                <p className={styles.artist}>{data.artist}</p>
              </div>
            </a>
          )}
        </div>
      </div>
      
      <button className={styles.toggleButton} onClick={() => setIsHidden(!isHidden)} aria-label="Toggle Spotify Widget">
        <ChevronIcon isHidden={isHidden} />
      </button>
    </div>
  );
};

export default SpotifyWidget;