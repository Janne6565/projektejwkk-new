import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ActivityChart from '@/components/display/ActivityChart/ActivityChart';
import { useModal } from '@/components/technical/modal-provider';
import { useContributionChartData } from '@/hooks/use-contribution-chart-data';
import useProjects from '@/hooks/use-projects';

const HERO_ROW_COUNT = 14;
const HERO_COL_COUNT = 22;

const SKELETON_KEYS = Array.from(
  { length: HERO_ROW_COUNT * HERO_COL_COUNT },
  (_, i) => `skeleton-${i}`,
);

const ChartLoadingSkeleton = () => (
  <div className="absolute inset-0 flex items-center justify-center p-4">
    <div className="activity-chart-fullscreen grid grid-flow-col gap-1.75 opacity-30">
      {SKELETON_KEYS.map((key) => (
        <div key={key} className="rounded-sm bg-muted animate-pulse" />
      ))}
    </div>
  </div>
);

const HeroSection = () => {
  const { projects, isLoading } = useProjects();
  const { weeks, maxContributions, isReady } = useContributionChartData(
    projects,
    { randomize: true, rowCount: HERO_ROW_COUNT, weekCount: HERO_COL_COUNT },
  );
  const { openDayModal } = useModal();
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {isLoading || !isReady ? (
        <ChartLoadingSkeleton />
      ) : (
        <ActivityChart
          weeks={weeks}
          maxContributions={maxContributions}
          onDayClick={openDayModal}
          animated
          fullscreen
          scrollTriggerRef={sectionRef}
        />
      )}

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center z-10 pointer-events-none drop-shadow-lg">
        {t('projects.heroTitle')}
      </h1>

      <div className="absolute bottom-8 animate-bounce z-10">
        <ChevronDown className="size-8 text-muted-foreground" />
      </div>
    </section>
  );
};

export default HeroSection;
