'use client'

import { Button } from "@/components/ui/button"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const setLocale = (newLocale: string) => {
    router.push(`${newLocale}`)
  }

  return (
    <Button className="rounded-full" onClick={() => setLocale(locale === 'en' ? 'ru' : 'en')} variant="outline" size="icon">
      {locale}
    </Button>
  )
}
