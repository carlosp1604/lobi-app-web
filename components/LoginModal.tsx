'use client'

import useTranslation from 'next-translate/useTranslation'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'
import { Result } from '~/types/Result'
import { useState } from 'react'
import { LoginForm } from '~/components/Forms/LoginForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'

interface LoginModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const { t } = useTranslation('auth')

  const [loading, setLoading] = useState<boolean>(false)

  const handleActionComplete = (result: Result<void, string>) => {
    if (result.success) {
      onOpenChange(false)
      toast.success(t('login_success_message_title'))
    }
  }

  return (
    <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
      <DialogContent
        className={ cn(
          'flex flex-col justify-start min-w-full h-screen rounded-none pt-24',
          'md:max-w-md md:min-w-auto md:h-auto md:py-8 md:rounded-lg',
          'duration-300 ease-fast-out zoom-in-98'
        ) }
      >
        <DialogHeader>
          <DialogTitle className="text-center md:text-left">
            { t('login_header_title') }
          </DialogTitle>
          <DialogDescription className="text-center md:text-left">
            { t('login_header_description') }
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          <LoginForm
            loading={ loading }
            onLoadingChange={ setLoading }
            onActionComplete={ handleActionComplete }
            onClickResetPassword={ () => onOpenChange(false) }
            onClickSignup={ () => onOpenChange(false) }
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
