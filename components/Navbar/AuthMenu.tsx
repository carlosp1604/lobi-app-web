'use client'

import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Button } from '~/components/ui/button';
import {User, LogOut, Loader2, CircleUserRound, LogIn, UserPlus} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useRouter } from 'next/router';
import { isActivePath } from "~/helpers/path.helper";
import {useAuth} from "~/hooks/useAuth";

export default function AuthMenu() {
  const { t } = useTranslation('navigation');
  const { status, user, logout } = useAuth();
  const router = useRouter();
  const { pathname } = useRouter();

  if (status === 'loading') {
    return (
      <div
        className="flex h-9 w-9 items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
        <span className="sr-only">
          {t('nav_bar_auth_loading_aria')}
        </span>
      </div>
    );
  }

  if (status === 'authenticated' && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full cursor-pointer"
            aria-label={t('nav_bar_user_menu_aria')}
          >
            <Avatar className="h-9 w-9 hover:scale-[1.05] ">
              <AvatarImage src={user.imageUrl || undefined} alt={t('nav_bar_avatar_alt')} />
              <AvatarFallback delayMs={600} aria-hidden="true">
                {/** TODO: Extract to helper **/}
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount sideOffset={8}>
          <DropdownMenuLabel
            className="font-normal"
            aria-label={t('nav_bar_profile_dropdown_user_info', { userName: user.name})}
          >
            <div className="flex flex-col space-y-1">
              <p className="font-semibold leading-none text-foreground">
                {user.name}
              </p>
              <p
                className="leading-none text-muted-foreground"
                aria-label={t('nav_bar_profile_dropdown_username_prefix', {username: user.username})}
              >
                {user.username.startsWith('@') ? user.username : `@${user.username}`}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {
            !isActivePath(`/users/${user.id}`, pathname) &&
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/users/${user.id}`)}>
              <User className="mr-2 h-4 w-4" aria-hidden="true" />
              {t('nav_bar_profile_dropdown_profile')}
            </DropdownMenuItem>
          }

          <DropdownMenuItem
            className="group cursor-pointer text-destructive focus:bg-destructive/10"
            onClick={async () => {await logout()}}
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('nav_bar_profile_dropdown_logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 w-9 cursor-pointer transition-transform hover:scale-[1.05] text-brand-primary"
          aria-label={t('nav_bar_auth_menu_aria')}
        >
          <CircleUserRound className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 mt-1">
        <DropdownMenuItem
          className="cursor-pointer font-medium"
          onClick={() => {
            const isCurrentPath = isActivePath('/auth/login', pathname)

            if (isCurrentPath) {
              return
            }
            router.push(`/auth/login/?callbackUrl=${encodeURIComponent(router.asPath)}`)}}
        >
          <LogIn className="mr-2 h-4 w-4 opacity-70" aria-hidden="true" />
          {t('nav_bar_auth_login_button')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer font-medium"
          onClick={() => router.push('/auth/signup/')}
        >
          <UserPlus className="mr-2 h-4 w-4 opacity-70" aria-hidden="true" />
          {t('nav_bar_auth_signup_button')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
