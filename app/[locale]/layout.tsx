import { ThemeProvider } from "@/components/theme-provider";
import { locale } from "@/types/i18n";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from "next-intl/server";
import { use } from "react";
import { SidebarInset, SidebarProvider } from '../../components/ui/sidebar7';
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
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional"
      />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
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
      </body>
    </html>
  );
}
