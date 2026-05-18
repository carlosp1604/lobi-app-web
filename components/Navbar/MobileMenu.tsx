import Link from 'next/link';
import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Menu } from "lucide-react";
import { Button } from '~/components/ui/button';
import {useRouter} from "next/router";
import { AppNavbarLink } from "~/components/Navbar/AppNavbar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '~/components/ui/sheet';

interface NavMobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  navLinks: Array<AppNavbarLink>;
}

export default function MobileMenu({ isOpen, setIsOpen, navLinks }: NavMobileMenuProps) {
  const { t } = useTranslation('nav_bar');
  const { pathname } = useRouter();

  return (
    <div className="xl:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 w-9 cursor-pointer"
            aria-label={t('nav_bar_menu_toggle_aria')}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">{t('nav_bar_menu_toggle_alt')}</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="border-r border-t-0 p-4 shadow-xl transition-all"
        >
          <SheetTitle className="text-left px-2 pt-1 font-semibold uppercase text-muted-foreground/70 tracking-wider mb-4">
            {t('nav_bar_menu_title')}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t('nav_bar_menu_description')}
          </SheetDescription>

          <nav aria-label={t('nav_bar_mobile_nav_aria')} className="flex flex-col gap-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;

              const isActive = pathname === link.href || pathname === link.href.replace(/\/$/, '');

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    flex items-center gap-x-3 w-full rounded-md px-3 py-2 font-medium
                    transition-all duration-200
                    hover:bg-accent hover:text-accent-foreground
                    active:scale-[0.98]
                    ${isActive
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                  `}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-80'}`}
                    aria-hidden="true"
                  />
                  <span>{t(link.labelKey)}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
