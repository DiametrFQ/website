'use client'

import { Button } from "@/components/ui/button"
import { useLocale } from "next-intl"
import { setLanguage } from "@/store/headerSettings/reducer";
import { locale } from "@/types/i18n";
import { useAppDispatch } from "@/store/hooks";

export function LanguageSwitcher() {
  const dispatch = useAppDispatch()
  const locale = useLocale();

  const setLocale = (newLocale: locale) => {
    dispatch(setLanguage(newLocale));
  }

  return (
    <Button className="rounded-full" onClick={() => setLocale(locale === 'en' ? 'ru' : 'en')} variant="outline" size="icon">
      {locale}
    </Button>
  )
}
