/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
   
import { ThemeProvider } from "@/components/theme-provider";
import StoreProvider from "@/store/StoreProvider";
import { locale } from "@/types/i18n";
import { SidebarInset, SidebarProvider } from '@ui/sidebar7';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from "next-intl/server";
import { use } from "react";
import Header from '../_components/Header/Header';
import Sidebar from '../_components/Sidebar/Sidebar';
import './_styles/globals.css';

type Props = {
  children: React.ReactNode,
  params: Promise<{ locale: locale }>
}

export default function RootLayout({ children, params }: Props) {
  const { locale } = use(params)
  const messages = use(getMessages());

  return (
    <html lang={locale}>
      <head>
        <link 
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />
      </head>
      <body>
        <StoreProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <Sidebar/>
                <SidebarInset>
                  <div>
                    <Header />
                    <main className="p-5">{children}</main>
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </ThemeProvider>       
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
