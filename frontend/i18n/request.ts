import { getRequestConfig } from 'next-intl/server';
import { locales } from '../types/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    if (!locale || !(locales as readonly string[]).includes(locale)) {
        locale = 'ru'; // Default fallback
    }

    return {
        locale,
        messages: (await import(`../locales/${locale}.json`)).default
    };
});
