import createMiddleware from 'next-intl/middleware'
import { locales } from '@/types/i18n';

export default createMiddleware({
    locales,
    defaultLocale: 'en'
})

export const config = {
    matcher: ['/', '/(ru|en)/:path+']
};