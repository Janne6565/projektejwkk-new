export interface DayCell {
  date: string; // "YYYY-MM-DD"
  dayOfWeek: number; // 0=Sunday ... 6=Saturday
  weekIndex: number;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface ChartWeek {
  weekIndex: number;
  days: DayCell[];
}
