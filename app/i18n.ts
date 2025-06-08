import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server'; 
// Типы нам все еще нужны для валидации
import {locales as appLocales, type locale as LocaleType} from '@/types/i18n'; 


export default getRequestConfig(async ({locale}) => { 
  // Валидация локали, переданной системой
  if (!appLocales.includes(locale as LocaleType)) {
    notFound(); 
  }

  return {
    locale, // Возвращать locale здесь не обязательно, если вы его просто используете
                      // но и не вредно. Главное, чтобы messages были для этой locale.
    messages: (await import(`../locales/${locale}.json`)).default
  };
});