'use client'

import useTranslation from 'next-translate/useTranslation'
import { Button } from '~/components/ui/button'
import { useAuth } from '~/hooks/useAuth'
import { useRouter } from 'next/router'
import { isActivePath } from '~/helpers/path.helper'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { User, LogOut, Loader2, CircleUserRound, LogIn, UserPlus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'

export default function AuthMenu() {
  const { t } = useTranslation('navigation')
  const { status, user, logout, setLoginOpen } = useAuth()
  const router = useRouter()
  const { asPath } = useRouter()

  if (status === 'loading') {
    return (
      <div
        className="flex h-9 w-9 items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
        <span className="sr-only">
          { t('nav_bar_auth_loading_aria') }
        </span>
      </div>
    )
  }

  if (status === 'authenticated' && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full"
            aria-label={ t('nav_bar_user_menu_aria') }
          >
            <Avatar className="h-9 w-9 hover:scale-[1.05]">
              <AvatarImage src={ user.imageUrl || undefined } alt={ t('nav_bar_avatar_alt') } />
              <AvatarFallback delayMs={ 600 } aria-hidden="true">
                { /** TODO: Extract to helper **/ }
                { user.name.charAt(0).toUpperCase() }
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 p-2" align="end" forceMount sideOffset={ 8 }>
          <DropdownMenuLabel aria-label={ t('nav_bar_profile_dropdown_user_info', { userName: user.name }) }>
            <div className="flex flex-col space-y-1.5">
              <p className="font-semibold leading-none text-foreground">
                { user.name }
              </p>
              <p
                className="leading-none text-muted-foreground"
                aria-label={ t('nav_bar_profile_dropdown_username_prefix', { username: user.username }) }
              >
                { user.username.startsWith('@') ? user.username : `@${user.username}` }
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {
            !isActivePath(`/users/${user.username}`, asPath) &&
            <DropdownMenuItem onClick={ () => router.push(`/users/${user.username}`) }>
              <User className="h-5 w-5 mr-2" aria-hidden="true" />
              { t('nav_bar_profile_dropdown_profile') }
            </DropdownMenuItem>
          }

          <DropdownMenuItem variant="destructive" onClick={ async () => {await logout()} }>
            <LogOut className="h-5 w-5 mr-2" aria-hidden="true" />
            { t('nav_bar_profile_dropdown_logout') }
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const isSignupActive = isActivePath('/auth/signup/', asPath)

  if (isSignupActive) {
    return (
      <Button
        variant="ghost"
        className="h-9 w-9 transition-transform hover:scale-[1.05] text-brand-primary"
        onClick={ () => setLoginOpen(true) }
        aria-label={ t('nav_bar_auth_login_button') }
      >
        <CircleUserRound className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full transition-transform hover:scale-[1.05] text-brand-primary"
          aria-label={ t('nav_bar_auth_menu_aria') }
        >
          <CircleUserRound className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 mt-1">
        <DropdownMenuItem onClick={ () => setLoginOpen(true) }>
          <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
          { t('nav_bar_auth_login_button') }
        </DropdownMenuItem>
        <DropdownMenuItem onClick={ () => router.push('/auth/signup/') }>
          <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
          { t('nav_bar_auth_signup_button') }
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
