import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Result } from "~/types/Result";
import useTranslation from "next-translate/useTranslation";
import LoginForm from "~/components/Forms/LoginForm";
import { useState } from "react";
import {toast} from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const { t } = useTranslation('auth');

  const [loading, setLoading] = useState<boolean>(false);

  const handleActionComplete = (result: Result<void, string>) => {
    if (result.success) {
      onOpenChange(false);
    }

    toast.success(t('login_success_message_title'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] duration-100 ease-fast-out zoom-in-98">
        <DialogHeader>
          <DialogTitle>
            {t('login_header_title')}
          </DialogTitle>
          <DialogDescription>
            {t('login_header_description')}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          <LoginForm
            loading={loading}
            onLoadingChange={ setLoading }
            onActionComplete={ handleActionComplete }
            onClickResetPassword={ () => onOpenChange(false) }
            onClickSignup={ () => onOpenChange(false) }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
