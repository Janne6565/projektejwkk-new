import { useMemo } from 'react';
import { eachDayOfInterval, getWeekStart, subWeeks, toDateString } from '@/lib/date-utils';
import type { ChartWeek, DayCell, DayContribution } from '@/types/contribution-chart';
import type { Project } from '@/types/project';

function getIntensity(
  count: number,
  max: number,
): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (max <= 1) return 4;
  // Logarithmic encoding: spreads low counts (1-3) across visible levels
  // instead of compressing them all into level 1 like linear quartiles would.
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
}

export function useContributionChartData(
  projects: Project[] | undefined,
  options: UseContributionChartDataOptions = {},
) {
  const { weekCount = 22, randomize = false, rowCount = 7 } = options;

  return useMemo(() => {
    if (!projects || projects.length === 0) {
      return { weeks: [], maxContributions: 0, isReady: false };
    }

    // Collect all contributions with project info, grouped by day
    const contributionsByDay = new Map<string, DayContribution[]>();
    for (const project of projects) {
      for (const c of project.contributions) {
        const existing = contributionsByDay.get(c.day) ?? [];
        existing.push({
          projectName: project.name,
          projectUuid: project.uuid,
          type: c.type,
          reference: c.reference,
          repositoryUrl: c.repositoryUrl,
        });
        contributionsByDay.set(c.day, existing);
      }
    }

    // Get only days that have contributions (for random selection)
    const contributedDays = Array.from(contributionsByDay.entries()).filter(
      ([, contribs]) => contribs.length > 0,
    );

    const rand = seededRandom(42);

    // Sequential layout: rowCount days per column, column-major ordering.
    // Used when rowCount !== 7 (non-calendar grid).
    if (rowCount !== 7) {
      const totalDays = rowCount * weekCount;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dayCells: DayCell[] = Array.from({ length: totalDays }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (totalDays - 1 - i));
        const dateStr = toDateString(date);

        let contributions: DayContribution[];
        let cellDate: string;

        if (randomize && contributedDays.length > 0) {
          const idx = Math.floor(rand() * contributedDays.length);
          const [randomDay, randomContribs] = contributedDays[idx];
          contributions = randomContribs;
          cellDate = randomDay;
        } else {
          contributions = contributionsByDay.get(dateStr) ?? [];
          cellDate = dateStr;
        }

        return {
          date: cellDate,
          dayOfWeek: i % rowCount, // repurposed as rowIndex for sequential layout
          weekIndex: Math.floor(i / rowCount), // colIndex
          contributions,
          intensity: 0 as const,
        };
      });

      const maxContributions = Math.max(
        ...dayCells.map((d) => d.contributions.length),
        1,
      );
      for (const cell of dayCells) {
        cell.intensity = getIntensity(cell.contributions.length, maxContributions);
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

    // Calendar week layout (rowCount === 7): group by day-of-week within each week.
    const today = new Date();
    const endDate = getWeekStart(today);
    endDate.setDate(endDate.getDate() + 6);
    const startDate = subWeeks(getWeekStart(today), weekCount - 1);

    const allDays = eachDayOfInterval(startDate, endDate);

    const dayCells: DayCell[] = allDays.map((date) => {
      const dateStr = toDateString(date);

      let contributions: DayContribution[];
      let cellDate: string;

      if (randomize && contributedDays.length > 0) {
        const idx = Math.floor(rand() * contributedDays.length);
        const [randomDay, randomContribs] = contributedDays[idx];
        contributions = randomContribs;
        cellDate = randomDay;
      } else {
        contributions = contributionsByDay.get(dateStr) ?? [];
        cellDate = dateStr;
      }

      return {
        date: cellDate,
        dayOfWeek: date.getDay(),
        weekIndex: Math.floor(
          (date.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
        ),
        contributions,
        intensity: 0 as const,
      };
    });

    const maxContributions = Math.max(
      ...dayCells.map((d) => d.contributions.length),
      1,
    );
    for (const cell of dayCells) {
      cell.intensity = getIntensity(cell.contributions.length, maxContributions);
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
  }, [projects, weekCount, randomize, rowCount]);
}
