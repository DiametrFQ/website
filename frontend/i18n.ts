import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  // Ensure locale is defined, default to 'ru' or 'en' if necessary, though dynamic routing usually handles it.
  if (!locale) locale = 'ru';

  return {
    messages: (await import(`./locales/${locale}.json`)).default
  };
});
