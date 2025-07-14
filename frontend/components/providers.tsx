'use client';

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar7';
import StoreProvider from "@/store/StoreProvider";
import Header from '@/app/_components/Header/Header';
import AppSidebar from '@/app/_components/Sidebar/Sidebar'; // Используем новое имя
import NowPlaying from '@/app/_components/NowPlaying/NowPlaying';

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
};

export default function Providers({ children, locale, messages }: Props) {
  return (
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
        </NextIntlClientProvider>
      </ThemeProvider>
      <NowPlaying />
    </StoreProvider>
  );
}