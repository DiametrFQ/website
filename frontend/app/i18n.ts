import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server'; 
import {locales as appLocales, type locale as tyeLocale} from '@/types/i18n'; 

export default getRequestConfig(async ({locale}) => {
  if (!appLocales.includes(locale as tyeLocale)) notFound();

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default
  };
});