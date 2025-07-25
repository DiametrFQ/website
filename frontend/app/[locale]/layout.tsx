/* eslint-disable @next/next/no-page-custom-font */
import { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Script from "next/script.js";
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar7';
import StoreProvider from "@/store/StoreProvider";
import { locales as appLocales } from '@/types/i18n';
import Header from '../_components/Header/Header';
import NowPlaying from "../_components/NowPlaying/NowPlaying";
import AppSidebar from '../_components/Sidebar/Sidebar';
import CookieBanner from '../_components/CookieBanner/CookieBanner';
import '../_styles/globals.css';
import "@fontsource/material-symbols-outlined";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      default: t('defaultTitle'),
      template: `%s | ${t('template')}`,
    },
    description: t('defaultDescription'),
    keywords: ['Дмитрий Хохлов', 'Dmitry Khokhlov', 'FullStack Developer', 'React', 'Next.js', 'TypeScript', 'Портфолио', 'Rust'],
    authors: [{ name: 'Dmitry Khokhlov', url: 'https://diametrfq.ru' }],
    creator: 'Dmitry Khokhlov',
  };
}

export function generateStaticParams() {
  return appLocales.map((locale) => ({locale}));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        {/* === ИЗМЕНЕНИЕ ЗДЕСЬ === */}
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(102356747, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true
              });
            `
          }}
        />
        {/* ======================= */}
        <noscript><div><img src="https://mc.yandex.ru/watch/102356747" style={{position:'absolute', left:'-9999px'}} alt="" /></div></noscript>
      </head>
      <GoogleAnalytics gaId="G-7VQWEH45FM"/>
      <body>
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider locale={locale} messages={messages}>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <div>
                    <Header />
                    <main className="p-5">{children}</main>
                  </div>
                </SidebarInset>
              </SidebarProvider>
              <NowPlaying />
              <CookieBanner />
            </NextIntlClientProvider>
          </ThemeProvider>
        </StoreProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Dmitry Khokhlov",
              "url": "https://diametrfq.ru",
              "image": "https://diametrfq.ru/my-photo.jpg",
              "sameAs": [
                "https://github.com/DiametrFQ",
                "https://www.linkedin.com/in/diametrfq",
                "https://t.me/diametrfq"
              ],
              "jobTitle": "FullStack Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "Cyberia"
              }
            })
          }}
        />
      </body>
    </html>
  );
}