'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

const contacts = [
  {
    name: 'telegram',
    handle: '@diametrfq',
    url: 'https://t.me/diametrfq',
    iconUrl: '/logo/telegram.svg',
  },
  {
    name: 'linkedin',
    handle: 'Dmitry Khokhlov',
    url: 'https://www.linkedin.com/in/diametrfq',
    iconUrl: '/logo/linkedin.svg',
  },
  {
    name: 'github',
    handle: 'DiametrFQ',
    url: 'https://github.com/DiametrFQ',
    iconUrl: '/logo/github.png',
    themeBehavior: 'invertOnDark',
  },
  {
    name: 'email',
    handle: 'hohlov.03@inbox.ru',
    url: 'mailto:hohlov.03@inbox.ru',
    iconUrl: '/logo/email.png',
  },
  {
    name: 'steam',
    handle: 'diametrfq',
    url: 'https://steamcommunity.com/id/diametrfq/',
    iconUrl: '/logo/steam.png',
  },
    {
    name: 'workEmail',
    handle: 'diameterfq@gmail.com',
    url: 'mailto:diameterfq@gmail.com',
    iconUrl: '/logo/gmail.svg',
  },
];

export default function Contact() {
  const t = useTranslations('ContactPage');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.subtitle}>{t('subtitle')}</p>
      <div className={styles.grid}>
        {contacts.map((contact) => (
          <a
            key={contact.name}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <div className={styles.iconWrapper}>
              <Image
                src={contact.iconUrl}
                alt={`${contact.name} logo`}
                width={48}
                height={48}
                className={`${styles.icon} ${contact.themeBehavior ? styles[contact.themeBehavior] : ''}`}
              />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{t('logoNames.'+contact.name)}</h2>
              <p className={styles.cardHandle}>{contact.handle}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}