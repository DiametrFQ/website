'use client';

import { SidebarInset, SidebarProvider } from '../components/ui/sidebar7';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    
  return (
    <html lang="ru">
      <head>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
      </head>
      <body>
        <SidebarProvider>
          <Sidebar/>
          <SidebarInset>
            <div>
              <Header />
              <main>{children}</main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
