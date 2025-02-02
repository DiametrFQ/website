// import { AbstractIntlMessages } from 'next-intl';
// import { notFound } from 'next/navigation';

// export type locale = 'ru' | 'en'
// export const locales = ['ru', 'en'] as const

// export default getRequestConfig(async ({locale}:{locale: locale}) => {
//     if (!locales.includes(locale)) notFound();

//     return (await import(`@locales/${locale}.json`)).default as unknown as AbstractIntlMessages
// })