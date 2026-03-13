import { useState } from 'react';
import type { DayContribution } from '@/types/contribution-chart';
import type { Project } from '@/types/project';

export type ModalState =
  | { type: 'none' }
  | { type: 'day'; date: string; contributions: DayContribution[] }
  | { type: 'project'; project: Project };

export function useProjectModal() {
  const [state, setState] = useState<ModalState>({ type: 'none' });

  const openDayModal = (date: string, contributions: DayContribution[]) => {
    setState({ type: 'day', date, contributions });
  };

  const openProjectModal = (project: Project) => {
    setState({ type: 'project', project });
  };

  const close = () => setState({ type: 'none' });

  return { state, openDayModal, openProjectModal, close };
}
