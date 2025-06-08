'use client'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar7';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ToggleSidebarButton from './components/ToggleSidebarButton';
import './styles/global.css';

const items = [
  { title: 'home', url: '/', iconName: 'home' },
  { title: 'about', url: '/about', iconName: 'docs' },
  { title: 'portfolio', url: '/portfolio', iconName: 'groups' },
  { title: 'contact', url: '/contact', iconName: 'groups' },
  { title: 'telegram', url: '/telegram', iconName: 'groups' },
]

export default function AppSidebar() {
  const pathname = usePathname();
  const locale = useLocale();

  const t = useTranslations('SidebarNavigation');

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <ToggleSidebarButton />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className='stroke-pink-700'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/${locale}${item.url}`}
                          className={pathname === `/${locale}${item.url}` ? 'bg-black dark:bg-white' : ''}
                        >
                          <span className="material-symbols-outlined">{item.iconName}</span>
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
};
