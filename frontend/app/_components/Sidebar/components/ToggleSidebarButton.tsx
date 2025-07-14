'use client';

import Image from 'next/image';
import { useSidebar } from '@/components/ui/sidebar7';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export function BurgerSidebarTrigger({ className }: Props) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('rounded-lg', className)}
      onClick={toggleSidebar}
      aria-label="Toggle Sidebar"
    >
      <Image
        src="/burger.svg"
        alt="Menu"
        width={24}
        height={24}
        style={{ filter: 'var(--invert-filter, invert(0))' }}
      />
    </Button>
  );
}