import createMiddleware from 'next-intl/middleware';
import { locales, type locale as LocaleType } from './types/i18n';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale: 'en' as LocaleType,
    localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        '/',
        '/(ru|en)/:path*',
        '/((?!api|_next|.*\\..*).*)'
    ]
};
