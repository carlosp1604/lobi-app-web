'use client'

import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { AppLoader } from '~/components/AppLoader'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'

const AppMap = dynamic(
  () => import('~/components/AppMap/AppMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <AppLoader />
      </div>
    ),
  }
)

export interface LatLngStringLiteral { lat: string; lng: string }
export interface LatLngNumberLiteral { lat: number; lng: number }

interface LocationMapModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  onConfirm: (location: LatLngStringLiteral) => void
  initialLocation: LatLngStringLiteral | null
  radius?: {
    initialValue: number
    onChange: (value: number) => void
  }
}

export const LocationMapModal = ({
  isOpen,
  title,
  initialLocation,
  onClose,
  onConfirm,
  radius = undefined,
}: LocationMapModalProps) => {
  const { t } = useTranslation('activities')

  const [tempLocation, setTempLocation] = useState<LatLngNumberLiteral | null>(null)

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line @eslint-react/set-state-in-effect
      setTempLocation(
        initialLocation
          ? { lat: Number(initialLocation.lat), lng: Number(initialLocation.lng) }
          : null
      )
    }
  }, [isOpen, initialLocation])

  const handleSave = () => {
    if (tempLocation) {
      onConfirm({
        lat: tempLocation.lat.toFixed(8),
        lng: tempLocation.lng.toFixed(8),
      })
    }
  }

  return (
    <Dialog
      open={ isOpen }
      onOpenChange={ (open) => !open && onClose() }
    >
      <DialogContent
        className={ cn(
          'flex flex-col pt-10 min-w-full h-screen rounded-none',
          'md:h-auto md:pt-8 md:rounded-lg md:max-w-lg md:min-w-auto',
          'duration-300 ease-fast-out zoom-in-98'
        ) }
      >
        <DialogHeader>
          <DialogTitle>
            { title }
          </DialogTitle>
          <DialogDescription>
            { t('geographic_modal_description_title') }
          </DialogDescription>
        </DialogHeader>
        <div className="h-full md:h-[500px]">
          { isOpen && (
            <AppMap
              initialRadius={ radius ? radius.initialValue : undefined }
              onRadiusChange={ radius ? radius.onChange : undefined }
              initialLocation={ tempLocation || undefined }
              onLocationChange={ setTempLocation }
            />
          ) }
        </div>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={ onClose }
          >
            { t('geographic_modal_cancel_button_title') }
          </Button>
          <Button
            type="button"
            onClick={ handleSave }
          >
            { t('geographic_modal_confirm_button_title') }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
