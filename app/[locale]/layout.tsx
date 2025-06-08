import { ThemeProvider } from "@/components/theme-provider";
import StoreProvider from "@/store/StoreProvider";
import { SidebarInset, SidebarProvider } from '@ui/sidebar7';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import Header from '../_components/Header/Header'; // Путь изменится из-за [locale]
import Sidebar from '../_components/Sidebar/Sidebar'; // Путь изменится
import '../_styles/globals.css'; // Путь изменится
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from "next/script.js";
import { locales as appLocales } from '@/types/i18n';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Для статической генерации страниц для каждой локали (опционально, но рекомендуется)
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
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}\n
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})\n
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");\n

              ym(102356747, "init", {\n
                    clickmap:true,\n
                    trackLinks:true,\n
                    accurateTrackBounce:true,\n
                    webvisor:true\n
              });\n
            `
          }}
        />
      </head>
      <GoogleAnalytics gaId="G-7VQWEH45FM"/>
      <body>
        <StoreProvider> {/* Redux нужен для других вещей, например, счетчика */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider locale={locale} messages={messages}>
              <SidebarProvider>
                <Sidebar/>
                <SidebarInset>
                  <div>
                    <Header />
                    <main className="p-5">{children}</main>
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}