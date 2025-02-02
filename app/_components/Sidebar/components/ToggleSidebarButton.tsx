import SVGImageElement from 'next/image';
import { useSidebar } from '@/components/ui/sidebar7';
import style from './styles/toggleSidebarButton.module.css';

const ToggleSidebarButton = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <div onClick={toggleSidebar} className={style.toggleButton}>
      <SVGImageElement 
        className='m-auto my-px'
        src="/burger.svg" 
        alt="☰" 
        width={36} 
        height={36}
      />
    </div>
  );
};

export default ToggleSidebarButton;