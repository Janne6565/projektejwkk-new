import { createContext, useContext, type ReactNode } from 'react';
import { useProjectModal } from '@/hooks/use-project-modal';

type ModalContextType = ReturnType<typeof useProjectModal>;

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const modal = useProjectModal();

  return (
    <ModalContext.Provider value={modal}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within a ModalProvider');
  return ctx;
};
