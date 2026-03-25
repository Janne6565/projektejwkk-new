import { useMemo } from 'react';

export interface StarData {
  date: string;
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

export function useStarContributions(calendar: Record<string, number> | undefined) {
  return useMemo(() => {
    if (!calendar || Object.keys(calendar).length === 0) {
      return {
        stars: [] as StarData[],
        uniqueDates: [] as string[],
        earliestDate: '',
        latestDate: '',
        totalContributions: 0,
        isReady: false,
      };
    }

    // Filter to days with contributions and sort by date
    const entries = Object.entries(calendar)
      .filter(([, count]) => count > 0)
      .sort(([a], [b]) => a.localeCompare(b));

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

    const maxCount = Math.max(...entries.map(([, c]) => c));
    const rand = seededRandom(42);
    const uniqueDates = entries.map(([date]) => date);

    // Create one star per contribution (expand count into individual stars)
    const stars: StarData[] = [];
    for (const [date, count] of entries) {
      for (let i = 0; i < count; i++) {
        stars.push({
          date,
          x: rand(),
          y: rand(),
          size: 0.3 + (count / maxCount) * 0.7,
          threshold: 0,
          phase: rand() * Math.PI * 2,
        });
      }
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
  }, [calendar]);
}
