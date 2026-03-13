import { useMemo } from 'react';
import type { Contribution } from '@/types/project';
import { useContributionChartData } from '@/hooks/use-contribution-chart-data';
import ActivityChart from '@/components/display/ActivityChart/ActivityChart';

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
    useContributionChartData(pseudoProjects, { weekCount: 22 });

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
