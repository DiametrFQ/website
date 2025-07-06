import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server'; 

import {locales as appLocales, type locale as LocaleType} from '@/types/i18n'; 

export default getRequestConfig(async ({locale}) => {
  if (!appLocales.includes(locale as LocaleType)) {
    notFound(); 
  }

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default
  };
});