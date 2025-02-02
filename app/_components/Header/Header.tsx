import Link from 'next/link.js';
import styles from './header.module.css';
import { ThemeSwitcher } from './_comonents/ThemeSwitcher/ThemeSwitcher';
import { LanguageSwitcher } from './_comonents/LanguageSwitcher/LanguageSwitcher';
import { MusicButton } from './_comonents/MusicButton/MusicButton';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/">
        <span className={styles.logo}>DiametrFQ</span>
      </Link>
      <div className={styles.options}>
        <MusicButton />
        {/* <LanguageSwitcher /> */}
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;