import styles from './styles/sidebar.module.css';
import './styles/global.css';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <nav>
        <ul>
          <li><Link href="/">Главная</Link></li>
          <li><Link href="/about">Обо мне</Link></li>
          <li><Link href="/projects">Проекты</Link></li>
          <li><Link href="/contact">Контакты</Link></li>
          <li><Link href='/telegram'>Telegram</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;