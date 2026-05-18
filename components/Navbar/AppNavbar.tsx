import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { Button } from '~/components/ui/button';
import { useAuth} from "~/hooks/useAuth";
import {ComponentType, SVGProps, useState} from 'react';
import {Activity, HelpCircle, Milestone, Trophy} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription
} from '~/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import AuthMenu from "~/components/Navbar/AuthMenu";
import MobileMenu from "~/components/Navbar/MobileMenu";

export interface AppNavbarLink {
  labelKey: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function AppNavbar() {
  const { t } = useTranslation('nav_bar');
  const [isOpen, setIsOpen] = useState(false);

  const navLinks: Array<AppNavbarLink> = [
    {
      labelKey: 'nav_bar_link_activities',
      href: '/activities/',
      icon: Trophy
    },
    {
      labelKey: 'nav_bar_link_faq',
      href: '/faq/',
      icon: HelpCircle
    },
    {
      labelKey: 'nav_bar_link_roadmap',
      href: '/roadmap/',
      icon: Milestone
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-8">
          <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} navLinks={navLinks} />

          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label={t('nav_bar_home_link_aria')}
          >
            <span className="font-bold inline-block text-lg sm:text-xl" aria-hidden="true">
              {t('nav_bar_app_logo_text')}
            </span>
          </Link>

          <nav aria-label={t('nav_bar_main_nav_aria')} className="hidden xl:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <nav aria-label={t('nav_bar_quick_links_aria')} className="hidden md:flex xl:hidden items-center gap-4 text-sm font-medium mr-2">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>
          <AuthMenu />
        </div>
      </div>
    </header>
  );
}
