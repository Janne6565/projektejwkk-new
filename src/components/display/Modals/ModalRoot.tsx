import { useModal } from '@/components/technical/modal-provider';
import DayDetailModal from './DayDetailModal';
import ProjectDetailModal from './ProjectDetailModal';

const ModalRoot = () => {
  const { state } = useModal();

  return (
    <>
      {state.type === 'day' && <DayDetailModal />}
      {state.type === 'project' && <ProjectDetailModal />}
    </>
  );
};

export default ModalRoot;
