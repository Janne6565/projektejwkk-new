import { useMemo } from 'react';
import { eachDayOfInterval, getWeekStart, subWeeks, toDateString } from '@/lib/date-utils';
import type { ChartWeek, DayCell } from '@/types/contribution-chart';

function getIntensity(
  count: number,
  max: number,
): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (max <= 1) return 4;
  const ratio = Math.log(count + 1) / Math.log(max + 1);
  return Math.min(4, Math.floor(ratio * 4) + 1) as 0 | 1 | 2 | 3 | 4;
}

// Seeded pseudo-random to keep results stable across renders
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

interface UseContributionChartDataOptions {
  /** Number of columns (calendar weeks when rowCount=7, arbitrary columns otherwise) */
  weekCount?: number;
  /** When true, every cell gets a randomly picked contributed day (no empty cells) */
  randomize?: boolean;
  /**
   * Number of rows. Default 7 = calendar week layout (Sun-Sat).
   * Any other value uses sequential layout: days fill column-major, rowCount days per column.
   */
  rowCount?: number;
  /** Override the end date of the chart window (defaults to today) */
  endDate?: Date;
}

export function useContributionChartData(
  calendar: Record<string, number> | undefined,
  options: UseContributionChartDataOptions = {},
) {
  const { weekCount = 22, randomize = false, rowCount = 7, endDate: customEndDate } = options;

  return useMemo(() => {
    if (!calendar || Object.keys(calendar).length === 0) {
      return { weeks: [], maxContributions: 0, isReady: false };
    }

    // Get only days that have contributions (for random selection)
    const contributedDays = Object.entries(calendar).filter(([, count]) => count > 0);
    const rand = seededRandom(42);

    // Sequential layout: rowCount days per column, column-major ordering.
    if (rowCount !== 7) {
      const totalDays = rowCount * weekCount;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dayCells: DayCell[] = Array.from({ length: totalDays }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (totalDays - 1 - i));
        const dateStr = toDateString(date);

        let count: number;
        let cellDate: string;

        if (randomize && contributedDays.length > 0) {
          const idx = Math.floor(rand() * contributedDays.length);
          const [randomDay, randomCount] = contributedDays[idx];
          count = randomCount;
          cellDate = randomDay;
        } else {
          count = calendar[dateStr] ?? 0;
          cellDate = dateStr;
        }

        return {
          date: cellDate,
          dayOfWeek: i % rowCount,
          weekIndex: Math.floor(i / rowCount),
          count,
          intensity: 0 as const,
        };
      });

      const maxContributions = Math.max(...dayCells.map((d) => d.count), 1);
      for (const cell of dayCells) {
        cell.intensity = getIntensity(cell.count, maxContributions);
      }

      const colMap = new Map<number, DayCell[]>();
      for (const cell of dayCells) {
        const col = colMap.get(cell.weekIndex) ?? [];
        col.push(cell);
        colMap.set(cell.weekIndex, col);
      }

      const weeks: ChartWeek[] = Array.from(colMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([weekIndex, days]) => ({
          weekIndex,
          days: days.sort((a, b) => a.dayOfWeek - b.dayOfWeek),
        }));

      return { weeks, maxContributions, isReady: true };
    }

    // Calendar week layout (rowCount === 7)
    const anchor = customEndDate ?? new Date();
    const endDate = getWeekStart(anchor);
    endDate.setDate(endDate.getDate() + 6);
    const rawStart = subWeeks(getWeekStart(anchor), weekCount - 1);
    const monthFirst = new Date(rawStart.getFullYear(), rawStart.getMonth(), 1);
    const startDate = getWeekStart(monthFirst);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allDays = eachDayOfInterval(startDate, endDate).filter(
      (d) => d >= monthFirst && d <= today,
    );

    const dayCells: DayCell[] = allDays.map((date) => {
      const dateStr = toDateString(date);

      let count: number;
      let cellDate: string;

      if (randomize && contributedDays.length > 0) {
        const idx = Math.floor(rand() * contributedDays.length);
        const [randomDay, randomCount] = contributedDays[idx];
        count = randomCount;
        cellDate = randomDay;
      } else {
        count = calendar[dateStr] ?? 0;
        cellDate = dateStr;
      }

      return {
        date: cellDate,
        dayOfWeek: date.getDay(),
        weekIndex: Math.floor(
          (date.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
        ),
        count,
        intensity: 0 as const,
      };
    });

    const maxContributions = Math.max(...dayCells.map((d) => d.count), 1);
    for (const cell of dayCells) {
      cell.intensity = getIntensity(cell.count, maxContributions);
    }

    const weeksMap = new Map<number, DayCell[]>();
    for (const cell of dayCells) {
      const existing = weeksMap.get(cell.weekIndex) ?? [];
      existing.push(cell);
      weeksMap.set(cell.weekIndex, existing);
    }

    const weeks: ChartWeek[] = Array.from(weeksMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([weekIndex, days]) => ({
        weekIndex,
        days: days.sort((a, b) => a.dayOfWeek - b.dayOfWeek),
      }));

    return { weeks, maxContributions, isReady: true };
  }, [calendar, weekCount, randomize, rowCount, customEndDate]);
}
