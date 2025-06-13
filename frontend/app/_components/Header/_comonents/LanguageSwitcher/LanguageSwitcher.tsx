'use client'

import { Button } from "@/components/ui/button"
import { useLocale } from "next-intl"
import { locale as LocaleType } from "@/types/i18n";
import { usePathname, useRouter } from "next/navigation"; 
import { useTransition } from 'react';
import { locales } from '@/types/i18n'; // Для переключения на следующую локаль

export function LanguageSwitcher() {
  const currentLocale = useLocale() as LocaleType;
  const router = useRouter();
  const currentPathname = usePathname(); // Это будет ПОЛНЫЙ pathname, включая локаль (например, /en/about)
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: LocaleType) => {
    if (newLocale === currentLocale || isPending) return;
    
    startTransition(() => {
      // При использовании хуков из next/navigation, нужно вручную убирать старый префикс локали
      // и добавлять новый, если он не совпадает с текущим.
      // Или, если next-intl middleware настроен правильно, он сам может справиться с редиректом.

      // Простой способ: router.replace с новым URL
      // Убираем текущий префикс локали из currentPathname, если он есть
      let pathnameWithoutLocale = currentPathname;
      if (currentPathname.startsWith(`/${currentLocale}`)) {
        pathnameWithoutLocale = currentPathname.substring(`/${currentLocale}`.length);
        if (pathnameWithoutLocale === '') pathnameWithoutLocale = '/'; // для корневого пути
      }
      
      router.replace(`/${newLocale}${pathnameWithoutLocale === '/' && newLocale !== 'en' ? '' : pathnameWithoutLocale}`);
      // router.refresh(); // Может понадобиться для обновления данных на сервере
    });
  }

  const getNextLocale = () => {
    const currentIndex = locales.indexOf(currentLocale);
    return locales[(currentIndex + 1) % locales.length];
  }

  return (
    <Button 
      className="rounded-full" 
      // onClick={() => switchLocale(currentLocale === 'en' ? 'ru' : 'en')} 
      onClick={() => switchLocale(getNextLocale())}
      variant="outline" 
      size="icon"
      disabled={isPending}
    >
      {currentLocale.toUpperCase() === 'EN' ? 'RU' : 'EN'}
    </Button>
  )
}