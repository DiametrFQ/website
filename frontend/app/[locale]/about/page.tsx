'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (elements.length) {
      observer.current = new IntersectionObserver((ioEntries) => {
        setEntries(ioEntries);
      }, options);

      elements.forEach(element => observer.current?.observe(element));
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [elements, options]);

  return [observer.current, setElements, entries] as const;
};


export default function ResumePage() {
  const t = useTranslations('AboutPage');
  const [showContact, setShowContact] = useState(false);
  const skillList: string[] = t.raw('skills.list');
  
  const [observer, setElements, entries] = useIntersectionObserver({
    threshold: 0.2,
    root: null
  });

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(`.${styles.animatedSection}`));
    setElements(sections as HTMLElement[]);
  }, [setElements]);

  useEffect(() => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(styles.isVisible);
        observer?.unobserve(entry.target);
      }
    });
  }, [entries, observer]);

  return (
    <div className={styles.container}> 
      <header className={`${styles.header} ${styles.animatedSection}`}>
        <h1>{t('name')}</h1>
        <p>{t('role')}</p>
        <button onClick={() => setShowContact(!showContact)} className={styles.contactButton}>
          {showContact ? t('hideContact') : t('showContact')}
        </button>
        {showContact && (
          <div className={styles.contactDetails}>
            <a href="tel:+79324770975" className={styles.contactLink}>
              <span className="material-symbols-outlined">call</span>
              {t('contact.phone')}
            </a>
            <a href="mailto:hohlov.03@inbox.ru" className={styles.contactLink}>
               <span className="material-symbols-outlined">email</span>
              {t('contact.email')}
            </a>
            <a href="https://t.me/diametrfq" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              {t('contact.telegram')}
            </a>
          </div>
        )}
      </header>

      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>
          <section className={`${styles.card} ${styles.animatedSection}`}>
            <h2>{t('about.title')}</h2>
            <p>{t('about.paragraph1')}</p>
            <p>{t('about.paragraph2')}</p>
          </section>

          <section className={`${styles.card} ${styles.animatedSection}`}>
            <h2>{t('experience.title')}</h2>
            <p><strong>{t('experience.job1.title')}</strong> – {t('experience.job1.company')}</p>
            <p>{t('experience.job1.description')}</p>
          </section>

          <section className={`${styles.card} ${styles.animatedSection}`}>
            <h2>{t('education.title')}</h2>
            <p><strong>{t('education.university.name')}</strong> ({t('education.university.year')}) – {t('education.university.faculty')}, {t('education.university.specialty')}</p>
          </section>

          <section className={`${styles.card} ${styles.animatedSection}`}>
            <h2>{t('skills.title')}</h2>
            <div className={styles.skillsContainer}>
              {skillList.map(skill => (
                <span key={skill} className={styles.skillTag}>{skill}</span>
              ))}
            </div>
          </section>

          <section className={`${styles.card} ${styles.animatedSection}`}>
            <h2>{t('projects.title')}</h2>
            <p>
              {t.rich('projects.description', {
                githubLink: (chunks) => <Link href="https://github.com/DiametrFQ" target="_blank" className={styles.link}>{chunks}</Link>
              })}
            </p>
          </section>
        </main>
        
        <aside className={`${styles.sidebar} ${styles.animatedSection}`}>
          <div className={styles.statsImages}>
            <Image src="https://www.codewars.com/users/DiametrFQ/badges/small" width={300} height={54} alt='Codewars stats' unoptimized/>
            <Image src="https://streak-stats.demolab.com?user=DiametrFQ&theme=github-dark-blue&border_radius=6&card_width=300&type=png" width={300} height={150} alt="GitHub Streak" unoptimized/>
            <Image src="https://github-readme-stats.vercel.app/api/top-langs/?username=DiametrFQ&layout=donut-vertical&theme=tokyonight" width={300} height={450} alt="GitHub Lengs" unoptimized />
          </div>
        </aside>
      </div>
    </div>
  );
}