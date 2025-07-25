'use client';

import { useState, useEffect } from 'react';
import styles from './CookieBanner.module.css';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('CookieBanner');
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
  // Задаем более темный и заметный серый фон для светлой темы
  const lightStyle = {
    backgroundColor: '#e5e7eb', // Контрастный светло-серый (Gray-200)
    color: '#1f2937',          // Темный текст (Gray-800) для лучшей читаемости
    borderTop: '1px solid #d1d5db', // Слегка более темная рамка (Gray-300)
  };

  const darkStyle = {
    backgroundColor: '#1f2937', // Непрозрачный темно-серый (Gray-800)
    color: '#f9fafb',
    borderTop: '1px solid #374151',
  };

  const currentStyle = theme === 'dark' ? darkStyle : lightStyle;

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div className={styles.banner} style={currentStyle}>
      <p className={styles.text}>
        {t('message')}
      </p>
      <button onClick={handleAccept} className={styles.button}>
        {t('acceptButton')}
      </button>
    </div>
  );
}