import useTranslation from "next-translate/useTranslation";
import { Button } from "~/components/ui/button";
import { InfoIcon, AlertTriangleIcon, XCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export interface InfoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  level?: "info" | "warning" | "error";
}

const iconMap = {
  info: <InfoIcon className="w-6 h-6 text-blue-500" />,
  warning: <AlertTriangleIcon className="w-6 h-6 text-amber-500" />,
  error: <XCircleIcon className="w-6 h-6 text-red-500" />,
};

export const InformationModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  level = "info",
}: InfoModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center sm:items-start gap-4 sm:flex-row">
          <div className="shrink-0 mt-0.5">{iconMap[level]}</div>
          <div className="space-y-1.5 text-center sm:text-left">
            <DialogTitle className="text-lg">{title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground whitespace-pre-wrap">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-end mt-2">
          <Button
            className="cursor-pointer"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            { t('common:information_modal_confirm_button_title') }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
