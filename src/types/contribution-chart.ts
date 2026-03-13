import type { Contribution } from './project';

export interface DayContribution {
  projectName: string;
  projectUuid: string;
  type: Contribution['type'];
  reference: string;
  repositoryUrl: string;
}

export interface DayCell {
  date: string; // "YYYY-MM-DD"
  dayOfWeek: number; // 0=Sunday ... 6=Saturday
  weekIndex: number;
  contributions: DayContribution[];
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface ChartWeek {
  weekIndex: number;
  days: DayCell[];
}
