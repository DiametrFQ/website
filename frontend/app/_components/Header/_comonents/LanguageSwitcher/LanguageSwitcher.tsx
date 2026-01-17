'use client'

import { Button } from "@/components/ui/button"
import { useLocale } from "next-intl"
import { locale as LocaleType } from "@/types/i18n";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from 'react';
import { locales } from '@/types/i18n';

export function LanguageSwitcher() {
  const currentLocale = useLocale() as LocaleType;
  const router = useRouter();
  const currentPathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: LocaleType) => {
    if (newLocale === currentLocale || isPending) return;

    startTransition(() => {
      let pathnameWithoutLocale = currentPathname;
      if (currentPathname.startsWith(`/${currentLocale}`)) {
        pathnameWithoutLocale = currentPathname.substring(`/${currentLocale}`.length);
        if (pathnameWithoutLocale === '') pathnameWithoutLocale = '/';
      }

      router.replace(`/${newLocale}${pathnameWithoutLocale === '/' && newLocale !== 'en' ? '' : pathnameWithoutLocale}`);
    });
  }

  const getNextLocale = () => {
    const currentIndex = locales.indexOf(currentLocale);
    return locales[(currentIndex + 1) % locales.length];
  }

  return (
    <Button
      className="rounded-full"
      onClick={() => switchLocale(getNextLocale())}
      variant="outline"
      size="icon"
      disabled={isPending}
      aria-label={`Switch language to ${currentLocale.toUpperCase() === 'EN' ? 'Russian' : 'English'}`}
    >
      {currentLocale.toUpperCase() === 'EN' ? 'RU' : 'EN'}
    </Button>
  )
}