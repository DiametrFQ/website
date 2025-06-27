import createMiddleware from 'next-intl/middleware';
import { locales, type locale as LocaleType } from './types/i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'en' as LocaleType,
  localePrefix: 'always'
});

export const config = {
  matcher: [
    '/',
    
    '/(ru|en)/:path*',

    '/((?!api|_next|.*\\..*).*)'
  ]
};