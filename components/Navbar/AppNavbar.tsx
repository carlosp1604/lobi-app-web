import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {Search, ChevronDown, Activity, Plus, HelpCircle, Milestone, Menu, CircleEllipsis} from 'lucide-react';
import { Button } from '~/components/ui/button';
import AuthMenu from '~/components/Navbar/AuthMenu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {isActivePath} from "~/helpers/path.helper";

export default function AppNavbar() {
  const { t } = useTranslation('navigation');
  const { pathname, push } = useRouter();

  const isSearchActive = isActivePath('/activities/', pathname);
  const isCreateActive = isActivePath('/activities/create/', pathname);
  const isFaqActive = isActivePath('/faq/', pathname);
  const isRoadmapActive = isActivePath('/roadmap/', pathname);
  const isActivitiesParentActive = isSearchActive || isCreateActive;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2" aria-label={t('nav_bar_home_link_aria')}>
            <span className="font-bold text-lg sm:text-xl" aria-hidden="true">
              {t('nav_bar_app_logo_text')}
            </span>
          </Link>
        </div>

          <NavigationMenu
            aria-label={t('nav_bar_main_nav_aria')}
            className="hidden md:flex items-center justify-center flex-1 px-4"
          >
            <NavigationMenuList className="gap-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`${navigationMenuTriggerStyle()} cursor-pointer ${isActivitiesParentActive ? 'bg-accent/50 text-brand-primary font-semibold' : ''}`}
                >
                  {t('nav_bar_link_activities_title')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[240px] gap-1">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/activities/"
                          aria-current={isSearchActive ? 'page' : undefined}
                          className={`flex items-center gap-x-2 rounded-sm p-2  ${isSearchActive ? 'text-brand-primary font-medium' : ''}`}
                        >
                          <Search className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                          {t('nav_bar_link_search_activities_title')}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/activities/create/"
                          aria-current={isCreateActive ? 'page' : undefined}
                          className={`flex items-center gap-x-2 rounded-sm p-2 ${isCreateActive ? 'text-brand-primary font-medium' : ''}`}
                        >
                          <Plus className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                          {t('nav_bar_link_create_activity_title')}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  aria-current={isFaqActive ? 'page' : undefined}
                  className={`${navigationMenuTriggerStyle()} cursor-pointer ${isFaqActive ? 'bg-accent text-brand-primary font-semibold' : ''}`}
                >
                  <Link href="/faq/">
                    {t('nav_bar_link_faq_title')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  aria-current={isRoadmapActive ? 'page' : undefined}
                  className={`${navigationMenuTriggerStyle()} cursor-pointer ${isRoadmapActive ? 'bg-accent text-brand-primary font-semibold' : ''}`}
                >
                  <Link href="/roadmap/">
                    {t('nav_bar_link_roadmap_title')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>

        <div className="flex items-center space-x-1">
          <div className="flex md:hidden items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={t('nav_bar_mobile_menu_aria')}
                >
                  <CircleEllipsis className="h-4 w-4" aria-hidden="true"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 mt-1 mr-2">
                <DropdownMenuLabel className="text-xs font-semibold uppercase text-muted-foreground/70">
                  {t('nav_bar_link_activities_title')}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className={`cursor-pointer ${isSearchActive ? 'text-brand-primary font-medium' : ''}`}
                  onClick={() => push('/activities/')}
                >
                  <Search className="mr-2 h-4 w-4 opacity-70" aria-hidden="true"/>
                  {t('nav_bar_link_search_activities_title')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`cursor-pointer ${isCreateActive ? 'text-brand-primary font-medium' : ''}`}
                  onClick={() => push('/activities/create/')}
                >
                  <Plus className="mr-2 h-4 w-4 opacity-70" aria-hidden="true"/>
                  {t('nav_bar_link_create_activity_title')}
                </DropdownMenuItem>

                <DropdownMenuSeparator/>

                <DropdownMenuItem
                  className={`cursor-pointer ${isFaqActive ? 'text-brand-primary font-medium' : ''}`}
                  onClick={() => push('/faq/')}
                >
                  <HelpCircle className="mr-2 h-4 w-4 opacity-70" aria-hidden="true"/>
                  {t('nav_bar_link_faq_title')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`cursor-pointer ${isRoadmapActive ? 'text-brand-primary font-medium' : ''}`}
                  onClick={() => push('/roadmap/')}
                >
                  <Milestone className="mr-2 h-4 w-4 opacity-70" aria-hidden="true"/>
                  {t('nav_bar_link_roadmap_title')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 cursor-pointer transition-colors ${isSearchActive ? 'text-brand-primary bg-accent/50' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => push('/activities/')}
            aria-label={t('nav_bar_search_button_aria')}
          >
            <Search className="h-5 w-5" aria-hidden="true"/>
          </Button>

          <AuthMenu/>
        </div>

      </div>
    </header>
  );
}
