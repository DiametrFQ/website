// import styles from './styles/sidebar.module.css';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar7';
import ToggleSidebarButton from './components/ToggleSidebarButton';
import './styles/global.css';

const items = [
  {
    title: 'Главная',
    url: '/',
    iconName: 'home',
  },
  {
    title: 'Обо мне',
    url: '/about',
    iconName: 'docs',
  },
  {
    title: 'Проекты',
    url: '/projects',
    iconName: 'groups',
  },
  {
    title: 'Контакты',
    url: '/contact',
    iconName: 'groups',
  },
  {
    title: 'Telegram',
    url: '/telegram',
    iconName: 'groups',
  },
]

const AppSidebar = () => {
  return (
    <Sidebar variant="floating" >
      <SidebarHeader>
        <ToggleSidebarButton/>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <span className="material-symbols-outlined">{item.iconName}</span>
                          <span>{item.title}</span>
                        </a>
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

export default AppSidebar;