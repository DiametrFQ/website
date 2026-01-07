import createMiddleware from 'next-intl/middleware';
import { locales, type locale as LocaleType } from './types/i18n';

const middleware = createMiddleware({
  locales,
  defaultLocale: 'en' as LocaleType,
  localePrefix: 'always'
});

export function proxy(request: any) {
  return middleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(ru|en)/:path*',
    '/((?!api|_next|.*\\..*).*)'
  ]
};