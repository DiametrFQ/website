'use client';

import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(() => !isMenuOpen);

  return (
    <html lang="ru">
      <body>
        <Header toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
        <div style={{ display: 'flex' }}>
          <Sidebar isOpen={isMenuOpen} />
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
