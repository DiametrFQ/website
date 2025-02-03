/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */

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
        <link 
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />
      </head>
      <body>
        <StoreProviderLayout>
          {children}
        </StoreProviderLayout>
      </body>
    </html>
  );
}
