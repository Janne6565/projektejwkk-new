import { useTranslation } from 'react-i18next';
import { useModal } from '@/components/technical/modal-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DayDetailModal = () => {
  const { state, close } = useModal();
  const { t } = useTranslation();

  if (state.type !== 'day') return null;

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{state.date}</DialogTitle>
          <DialogDescription>
            {state.count} {t('projects.contributionsOnDay')}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailModal;
