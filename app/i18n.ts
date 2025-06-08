import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server'; 
// Типы нам все еще нужны для валидации
import {locales as appLocales, type locale as LocaleType} from '@/types/i18n'; 

// ВАЖНО: Функция, передаваемая в getRequestConfig, ТЕПЕРЬ принимает {locale} как аргумент.
// next-intl/plugin будет вызывать эту функцию, передавая ей локаль,
// определенную через URL и middleware.


// Этот console.log поможет понять, сколько раз и когда загружается этот модуль
console.log('[app/i18n.ts] Module configuration loaded by Next.js');


export default getRequestConfig(async ({locale}) => { 
   console.log(`[app/i18n.ts] getRequestConfig called WITH locale: "${locale}"`);
  // Валидация локали, переданной системой
  if (!appLocales.includes(locale as LocaleType)) {
       console.warn(`[app/i18n.ts] Invalid locale received: "${locale}". Calling notFound().`);
    notFound(); 
  }

  return {
    locale, // Возвращать locale здесь не обязательно, если вы его просто используете
                      // но и не вредно. Главное, чтобы messages были для этой locale.
    messages: (await import(`../locales/${locale}.json`)).default
  };
});