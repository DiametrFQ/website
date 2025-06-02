"use client"

import { ThemeProvider } from "@/components/theme-provider";
import { setMessages } from "@/store/headerSettings/reducer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import StoreProvider from "@/store/StoreProvider";
import { SidebarInset, SidebarProvider } from '@ui/sidebar7';
import { NextIntlClientProvider } from 'next-intl';
import { useEffect } from "react";
import Header from './_components/Header/Header';
import Sidebar from './_components/Sidebar/Sidebar';
import './_styles/globals.css';
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from "next/script.js";

type Props = {
  children: React.ReactNode
}

function ViewsLayout({ children }: Props) {
  return (
    <>
      <Sidebar/>
      <SidebarInset>
        <div>
          <Header />
          <main className="p-5">{children}</main>
        </div>
      </SidebarInset>
    </>
  );
}

function SettingsLayout({ children }: Props) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.headerSettings.language) || 'en';
  const messages = useAppSelector((state) => state.headerSettings.messages);
  
  useEffect(() => {
    import(`@/app/_locales/${language}.json`).then(
      (data) => dispatch(setMessages(data.default))
    );
  }, [dispatch, language]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider locale={language} messages={messages || {}}>
        <SidebarProvider>
          <ViewsLayout>
            {children}
          </ViewsLayout>
        </SidebarProvider>
      </NextIntlClientProvider>
    </ThemeProvider> 
  );
}

function StoreProviderLayout({ children }: Props) {  
  return (
    <StoreProvider>
      <SettingsLayout>
        {children}       
      </SettingsLayout>
    </StoreProvider>
  );
}

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <head>
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(102356747, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true
              });
            `,
          }}
        />
      </head>
      <GoogleAnalytics gaId="G-7VQWEH45FM"/>
      <body>
        <StoreProviderLayout>
          {children}
        </StoreProviderLayout>
      </body>
    </html>
  );
}
