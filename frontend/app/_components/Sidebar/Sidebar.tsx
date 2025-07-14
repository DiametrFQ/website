'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, // 1. ИМПОРТИРУЕМ ХУК useSidebar
} from '@/components/ui/sidebar7';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BurgerSidebarTrigger } from './components/ToggleSidebarButton';
import styles from './styles/sidebar.module.css';
import './styles/global.css';

const items = [
  { title: 'home', url: '/', iconName: 'home' },
  { title: 'about', url: '/about', iconName: 'docs' },
  { title: 'portfolio', url: '/portfolio', iconName: 'groups' },
  { title: 'contact', url: '/contact', iconName: 'groups' },
  { title: 'telegram', url: '/telegram', iconName: 'groups' },
];

const onlyEng = items.filter((item) => item.title !== 'telegram').map((item) => item.title);

export default function AppSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('SidebarNavigation');

  // 2. ПОЛУЧАЕМ КОНТЕКСТ САЙДБАРА
  const { isMobile, setOpenMobile } = useSidebar();

  // 3. СОЗДАЕМ ОБРАБОТЧИК КЛИКА
  const handleLinkClick = () => {
    // Закрываем сайдбар только если мы на мобильном устройстве
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <div className={styles.desktopHeaderContainer}>
        <SidebarHeader>
          <BurgerSidebarTrigger />
        </SidebarHeader>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                (locale === 'en' && onlyEng.includes(item.title)) ||
                (locale === 'ru')
              ) && (
                <SidebarMenuItem key={item.title} className="stroke-pink-700">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/${locale}${item.url}`}
                          className={
                            pathname === `/${locale}${item.url}` ||
                            (item.url === '/' && pathname === `/${locale}`)
                              ? 'bg-accent text-accent-foreground'
                              : ''
                          }
                          // 4. ПРИМЕНЯЕМ ОБРАБОТЧИК КО ВСЕМ ССЫЛКАМ
                          onClick={handleLinkClick}
                        >
                          <span className="material-symbols-outlined">
                            {item.iconName}
                          </span>
                          <span>{t(`${item.title}.title`)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}