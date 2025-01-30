import Link from 'next/link.js';
import styles from './header.module.css'; // Для использования стилей

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/">
        <span className={styles.logo}>DiametrFQ</span>
      </Link>{" "}
    </header>
  );
};

export default Header;