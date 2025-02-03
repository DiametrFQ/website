import { getRequestConfig } from 'next-intl/server';
import { locale, locales } from '@/types/i18n';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
    const headersList = await headers();
    const pathname = headersList.get('referer') || '';
    const locale = pathname.split('/')[3] as locale || 'en';

    if (!locales.includes(locale)) notFound();

    return {
        locale,
        messages: (await import(`./_locales/${locale}.json`)).default
    };
});