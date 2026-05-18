import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Button } from '~/components/ui/button';
import { useAuth } from '~/hooks/useAuth';
import { User, LogOut, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export default function AuthMenu() {
  const { t } = useTranslation('nav_bar');
  const { status, user, login, logout } = useAuth();

  if (status === 'loading') {
    return (
      <div
        className="flex h-9 w-9 items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
        <span className="sr-only">{t('nav_bar_auth_loading_aria')}</span>
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
            <Avatar className="h-9 w-9 pointer-events-none">
              <AvatarImage src={user.avatarUrl || undefined} alt={t('nav_bar_avatar_alt')} />
              <AvatarFallback delayMs={600} aria-hidden="true">
                {user.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount sideOffset={8}>
          <DropdownMenuLabel
            className="font-normal"
            aria-label={t('nav_bar_profile_dropdown_user_info', { userName: user.userName})}
          >
            <div className="flex flex-col space-y-1">
              <p className="font-semibold leading-none text-foreground">
                {user.userName}
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

          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('nav_bar_profile_dropdown_profile')}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="group cursor-pointer text-destructive focus:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('nav_bar_profile_dropdown_logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      size="sm"
      onClick={login}
      className="cursor-pointer hover:opacity-80 bg-brand-primary text-primary-foreground font-medium"
    >
      {t('nav_bar_auth_login_button')}
    </Button>
  );
}
