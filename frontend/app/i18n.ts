import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server'; 
import {locales as appLocales} from '@/types/i18n'; 

export default getRequestConfig(async ({locale}) => {
  // Этот паттерн ({locale}) все еще нужен для вашей версии, несмотря на предупреждение
  if (!appLocales.includes(locale as any)) notFound();

  return {
    // Возвращаем LOCALE, чтобы исправить ошибку "A 'locale' is expected..."
    locale, 
    
    messages: (await import(`../locales/${locale}.json`)).default,
    
    // Возвращаем TIMEZONE, чтобы исправить ошибку "ENVIRONMENT_FALLBACK"
    timeZone: 'Europe/Moscow' 
  };
});