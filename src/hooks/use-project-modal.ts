import { useState } from 'react';
import type { Project } from '@/types/project';

export type ModalState =
  | { type: 'none' }
  | { type: 'day'; date: string; count: number }
  | { type: 'project'; project: Project };

export function useProjectModal() {
  const [state, setState] = useState<ModalState>({ type: 'none' });

  const openDayModal = (date: string, count: number) => {
    setState({ type: 'day', date, count });
  };

  const openProjectModal = (project: Project) => {
    setState({ type: 'project', project });
  };

  const close = () => setState({ type: 'none' });

  return { state, openDayModal, openProjectModal, close };
}
