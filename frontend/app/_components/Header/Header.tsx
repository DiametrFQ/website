import Link from 'next/link';
import styles from './header.module.css';
import { ThemeSwitcher } from './_comonents/ThemeSwitcher/ThemeSwitcher';
import { LanguageSwitcher } from './_comonents/LanguageSwitcher/LanguageSwitcher';
import { BurgerSidebarTrigger } from '../Sidebar/components/ToggleSidebarButton';

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Блок №1: для мобильного триггера */}
      <div className={styles.mobileTriggerContainer}>
        <BurgerSidebarTrigger />
      </div>
      
      {/* Блок №2: для логотипа */}
      <Link href="/" className={styles.logoLink}>
        <span className={styles.logo}>DiametrFQ</span>
      </Link>
      
      {/* Блок №3: для опций */}
      <div className={styles.options}>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;