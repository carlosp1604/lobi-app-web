'use client'

import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { toast } from 'sonner'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { AppLoader } from '~/components/AppLoader'
import { EmptyState } from '~/components/EmptyState'
import { AuthService } from '~/services/auth/AuthService'
import { useEffect, useState } from 'react'
import { Info, Laptop, Loader2, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  DeviceInfoDto, RelativeDateDto,
  UserActiveSessionsDto, UserCredentialDto
} from '~/types/auth/dto/GetUserSecurityDetailsResponseDto'

interface SecurityTabProps {
  onSessionClosed?: (sessionId: string) => void
}

export const SecuritySettings = ({ onSessionClosed }: SecurityTabProps) => {
  const { t } = useTranslation('user')

  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<Array<UserActiveSessionsDto>>([])
  const [credential, setCredential] = useState<UserCredentialDto | null>(null)

  const [closingIds, setClosingIds] = useState<string[]>([])

  const loadSessions = async () => {
    setLoading(true)

    const authService = new AuthService()
    const result = await authService.getUserSecurityDetails()

    setLoading(false)

    if (result.success) {
      setSessions(result.value.sessions)
      setCredential(result.value.credential)
    } else {
      const error = result.error

      toast.warning(t(error.getTranslationKey()))
    }
  }

  useEffect(() => {
    loadSessions().then()
  // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [])

  const handleCloseSession = async (sessionId: string) => {
    setClosingIds((prev) => [...prev, sessionId])

    const authService = new AuthService()

    const result = await authService.revokeSession(sessionId)

    setClosingIds((prev) => prev.filter((id) => id !== sessionId))

    if (result.success) {
      setSessions((prev) => prev.filter((session) => session.id !== sessionId))

      if (onSessionClosed) {
        onSessionClosed(sessionId)
      }
      toast.success(t('user_security_active_sessions_session_closed_title'))
    } else {
      toast(t(result.error.getTranslationKey()))
    }
  }

  const getRelativeDateTitle = (relativeDate: RelativeDateDto) => {
    return t(`user_security_active_sessions_relative_date_${relativeDate.unit}_title`, { quantity: relativeDate.quantity })
  }

  const getDeviceName = (device: DeviceInfoDto) => {
    const { hardware, os, browser } = device

    if (hardware.vendor && hardware.model) {
      return `${hardware.vendor} ${hardware.model}`
    }
    if (os.name && browser.name) {
      return `${os.name} • ${browser.name}`
    }

    return t('user_security_active_sessions_unknown_device_title')
  }

  const getDeviceIcon = (hardwareType: string | null) => {
    if (hardwareType === 'mobile' || hardwareType === 'tablet') {
      return <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5" />
    }

    return <Laptop className="h-5 w-5 text-muted-foreground mt-0.5" />
  }

  if (loading) {
    return (
      <div className="flex w-full min-h-[400px] justify-center">
        <AppLoader
          title={ t('user_security_loading_title') }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardHeader>
          <CardTitle>
            { t('user_security_security_settings_title') }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col space-y-1">
              <span className="font-medium">
                { t('user_security_security_settings_password_title') }
              </span>
              <span className="text-muted-foreground tracking-tight">
                {
                  credential &&
                  credential.lastModifiedAt.quantity === 0 &&
                  credential.lastModifiedAt.unit === 'minutes' &&
                  t('user_security_security_settings_password_never_modified_title') }
                {
                  credential &&
                  !(credential.lastModifiedAt.quantity === 0 && credential.lastModifiedAt.unit === 'minutes') &&
                  t('user_security_security_settings_password_last_modified_title',
                    { time: getRelativeDateTitle(credential.lastModifiedAt) })
                }
              </span>
            </div>

            <Button variant="outline" asChild>
              <Link href={ '/auth/reset/' }>
                { t('user_security_security_settings_change_password_button_title') }
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            { t('user_security_active_sessions_title') }
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          { sessions.map((session) => {
            const isClosing = closingIds.includes(session.id)

            return (
              <div key={ session.id } className="flex items-start justify-between">
                <div className="flex gap-4">
                  { getDeviceIcon(session.deviceInfo.hardware.type) }
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        { getDeviceName(session.deviceInfo) }
                      </span>
                      { session.isCurrent && (
                        <Badge variant="secondary" className="text-xs font-normal bg-green-500/25">
                          { t('user_security_active_sessions_current_session_badge_title') }
                        </Badge>
                      ) }
                    </div>
                    <div className="flex flex-col gap-y-0 md:flex-row md:gap-x-2 text-muted-foreground tracking-tight">
                      <span>
                        {
                          [session.deviceLocation.city, session.deviceLocation.countryCode].filter(Boolean).join(', ') ||
                          t('user_security_active_sessions_unknown_location_title')
                        }
                      </span>
                      <span className="hidden md:block">
                        { ' • ' }
                      </span>
                      <span>
                        { session.isCurrent ?
                          t('user_security_active_sessions_current_session_active_now_title') :
                          t('user_security_active_sessions_active_since_title', { time: getRelativeDateTitle(session.activeSince) })
                        }
                      </span>
                    </div>
                  </div>
                </div>

                { !session.isCurrent && (
                  <Button
                    variant="destructive"
                    size="lg"
                    disabled={ isClosing }
                    onClick={ () => handleCloseSession(session.id) }
                  >
                    { isClosing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t('user_security_active_sessions_close_session_button_title')
                    ) }
                  </Button>
                ) }
              </div>
            )
          }) }

          { sessions.length === 0 && (
            <EmptyState
              icon={ Info }
              title={ t('user_security_active_sessions_empty_state_title') }
              description={ t('user_security_active_sessions_empty_state_description') }
            />
          ) }
        </CardContent>
      </Card>
    </div>
  )
}
