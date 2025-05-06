'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useMedia } from 'react-use';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { HeaderNavigationButton } from './sub-components/header-navigation-button/header-navigation-button';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const routes = [
  {
    href: '/',
    label: 'Overview',
  },
  {
    href: '/transactions',
    label: 'Transactions',
  },
  {
    href: '/accounts',
    label: 'Accounts',
  },
  {
    href: '/categories',
    label: 'Categories',
  },
  {
    href: '/settings',
    label: 'Settings',
  },
];

export const HeaderNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isMobile = useMedia('(max-width: 1024px)', false);

  const pathname = usePathname();

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 border-none hover:bg-white/40 hover:text-white focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2 bg-blue-600 border-r-blue-800">
          <SheetHeader>
            <SheetTitle className="text-white text-xl">Finance</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col w-full gap-y-2 pt-6">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant="outline"
                onClick={() => onClick(route.href)}
                className="font-normal bg-white/10 hover:bg-white/10 justify-start hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <HeaderNavigationButton
          key={route.href}
          label={route.label}
          href={route.href}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};
