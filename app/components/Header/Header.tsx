import Link from 'next/link.js';
import styles from './header.module.css';
import SVGImageElement from 'next/image';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Header = ({toggleMenu, isMenuOpen}: HeaderProps) => {
  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={toggleMenu}>
        <SVGImageElement 
          src="/burger.svg" 
          alt="Menu" 
          width={36} 
          height={36} 
          style={{ 
              backgroundColor: 'white',
              margin: isMenuOpen 
                ? '0 107.5px' 
                : '0 36px', 
                transition: 'margin 0.3s ease-in-out'
          }}/>
      </button>
      <Link href="/">
        <span className={styles.logo}>DiametrFQ</span>
      </Link>
    </header>
  );
};

export default Header;