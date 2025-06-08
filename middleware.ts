// middleware.ts (в корне проекта)
import createMiddleware from 'next-intl/middleware';
import { locales, type locale as LocaleType } from './types/i18n'; // Путь к типам может отличаться, если middleware в корне

export default createMiddleware({
  locales,
  defaultLocale: 'en' as LocaleType,
  localePrefix: 'always' // Попробуйте также 'as-needed' для проверки, если 'always' не работает
});

console.log("Middleware is running for request:", new Date().toISOString()); 

export const config = {
  // Match only internationalized pathnames
  // Обновленный matcher, который должен быть более надежным:
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(ru|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|api|.*\\..*).*)' // Исключает служебные пути и файлы
  ]
};