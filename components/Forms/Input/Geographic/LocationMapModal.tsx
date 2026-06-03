import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import { Button } from "~/components/ui/button";
import { Loader } from "~/components/AppLoader";
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";

const AppMap = dynamic(
  () => import('~/components/AppMap/AppMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] bg-muted animate-pulse rounded-xl flex items-center justify-center text-muted-foreground text-sm">
        <Loader />
      </div>
    )
  }
)

export type LatLngStringLiteral = { lat: string; lng: string };
export type LatLngNumberLiteral = { lat: number; lng: number };

interface LocationMapModalProps {
  isOpen: boolean;
  title: string;
  initialLocation?: LatLngStringLiteral | null;
  onClose: () => void;
  onConfirm: (location: LatLngStringLiteral) => void;
}

export function LocationMapModal({ isOpen, title, initialLocation, onClose, onConfirm }: LocationMapModalProps) {
  const { t } = useTranslation('activities');

  const [tempLocation, setTempLocation] = useState<LatLngNumberLiteral | null>(null);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempLocation(
        initialLocation
          ? { lat: Number(initialLocation.lat), lng: Number(initialLocation.lng) }
          : null
      );
    }
  }, [isOpen, initialLocation]);

  const handleSave = () => {
    if (tempLocation) {
      onConfirm({
        lat: tempLocation.lat.toFixed(8),
        lng: tempLocation.lng.toFixed(8),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[350px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {t('geographic_modal_description_title')}
          </DialogDescription>
        </DialogHeader>
        <div className="h-[300px] md:h-[500px] overflow-hidden p-1">
          {isOpen && (
            <AppMap
              initialLocation={tempLocation || undefined}
              onLocationChange={setTempLocation}
            />
          )}
        </div>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            {t('geographic_modal_cancel_button_title')}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
          >
            {t('geographic_modal_confirm_button_title')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
