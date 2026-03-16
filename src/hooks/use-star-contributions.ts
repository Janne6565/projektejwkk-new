import { useMemo } from 'react';
import type { Project } from '@/types/project';

export interface StarData {
  date: string;
  projectName: string;
  x: number;
  y: number;
  /** Base radius factor 0.3–1.0, scaled by contribution count for that day */
  size: number;
  /** 0–1 position in the sorted timeline (used as scroll reveal threshold) */
  threshold: number;
  /** Random phase offset for twinkle animation */
  phase: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function useStarContributions(projects: Project[] | undefined) {
  return useMemo(() => {
    if (!projects || projects.length === 0) {
      return {
        stars: [] as StarData[],
        uniqueDates: [] as string[],
        earliestDate: '',
        latestDate: '',
        totalContributions: 0,
        isReady: false,
      };
    }

    // Build flat entries with project name, sorted by date
    const entries: { date: string; projectName: string }[] = [];
    for (const project of projects) {
      for (const c of project.contributions) {
        entries.push({ date: c.day, projectName: project.name });
      }
    }
    entries.sort((a, b) => a.date.localeCompare(b.date));

    if (entries.length === 0) {
      return {
        stars: [] as StarData[],
        uniqueDates: [] as string[],
        earliestDate: '',
        latestDate: '',
        totalContributions: 0,
        isReady: false,
      };
    }

    // Count per day (needed for size calculation)
    const countByDay = new Map<string, number>();
    for (const e of entries) {
      countByDay.set(e.date, (countByDay.get(e.date) ?? 0) + 1);
    }

    const sortedDays = Array.from(countByDay.keys()).sort();
    const maxCount = Math.max(...countByDay.values());
    const rand = seededRandom(42);
    const uniqueDates = sortedDays;

    // Build flat star list: one star per entry, sorted by date
    const stars: StarData[] = [];

    for (const entry of entries) {
      const count = countByDay.get(entry.date)!;
      stars.push({
        date: entry.date,
        projectName: entry.projectName,
        x: rand(),
        y: rand(),
        size: 0.3 + (count / maxCount) * 0.7,
        threshold: 0, // filled below
        phase: rand() * Math.PI * 2,
      });
    }

    // Assign thresholds: each star's position in the timeline 0–1
    const total = stars.length;
    for (let i = 0; i < total; i++) {
      stars[i].threshold = total > 1 ? i / (total - 1) : 0;
    }

    return {
      stars,
      uniqueDates,
      earliestDate: uniqueDates[0],
      latestDate: uniqueDates[uniqueDates.length - 1],
      totalContributions: total,
      isReady: true,
    };
  }, [projects]);
}
