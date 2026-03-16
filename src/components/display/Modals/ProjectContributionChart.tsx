import { useMemo } from 'react';
import type { Contribution } from '@/types/project';
import { useContributionChartData } from '@/hooks/use-contribution-chart-data';
import ActivityChart from '@/components/display/ActivityChart/ActivityChart';

const WEEK_COUNT = 20;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Find the end-date of the WEEK_COUNT-week window that contains the most contributions. */
function bestWindow(contributions: Contribution[]): Date {
  if (contributions.length === 0) return new Date();

  const timestamps = contributions
    .map((c) => new Date(c.day).getTime())
    .sort((a, b) => a - b);

  const windowMs = WEEK_COUNT * WEEK_MS;
  let bestEnd = timestamps[timestamps.length - 1];
  let bestCount = 0;

  // Sliding window: for each contribution as the window start, count how many
  // contributions fall within WEEK_COUNT weeks.
  let right = 0;
  for (let left = 0; left < timestamps.length; left++) {
    while (
      right < timestamps.length &&
      timestamps[right] - timestamps[left] <= windowMs
    ) {
      right++;
    }
    if (right - left > bestCount) {
      bestCount = right - left;
      bestEnd = timestamps[left] + windowMs;
    }
  }

  // Don't go past today
  return new Date(Math.min(bestEnd, Date.now()));
}

interface ProjectContributionChartProps {
  contributions: Contribution[];
  projectName: string;
  projectUuid: string;
}

const ProjectContributionChart = ({
  contributions,
  projectName,
  projectUuid,
}: ProjectContributionChartProps) => {
  const endDate = useMemo(() => bestWindow(contributions), [contributions]);

  // Create a minimal "project" structure to reuse the chart data hook
  const pseudoProjects = useMemo(
    () => [
      {
        uuid: projectUuid,
        name: projectName,
        contributions,
        // These fields are needed by the Project type but not used by the chart hook
        index: 0,
        descriptionEn: '',
        descriptionDe: '',
        description: null,
        isVisible: true,
        repositories: [],
        additionalInformation: {},
        contributionCount: contributions.length,
        lastContributionDate: null,
      },
    ],
    [contributions, projectName, projectUuid],
  );

  const { weeks, maxContributions, isReady } =
    useContributionChartData(pseudoProjects, { weekCount: WEEK_COUNT, endDate });

  if (!isReady) return null;

  return (
    <ActivityChart
      weeks={weeks}
      maxContributions={maxContributions}
      onDayClick={() => {}}
      className="w-full overflow-x-auto"
    />
  );
};

export default ProjectContributionChart;
