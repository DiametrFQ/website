import { MetadataRoute } from 'next';
import { locales } from '@/types/i18n';

// Обязательно укажите здесь ваш настоящий домен!
const BASE_URL = 'https://diametrfq.ru';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/about', '/contact', '/portfolio', '/telegram'];

  const sitemapEntries = routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${route === '/' ? '' : route}`,
      lastModified: new Date(),
    }))
  );

  return sitemapEntries;
}