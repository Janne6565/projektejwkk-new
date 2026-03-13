import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ChartWeek, DayContribution } from '@/types/contribution-chart';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ChartLegend from './ChartLegend';
import WeekdayLabels from './WeekdayLabels';

gsap.registerPlugin(ScrollTrigger);

function intensityClass(intensity: 0 | 1 | 2 | 3 | 4): string {
  const classes: Record<number, string> = {
    0: 'bg-muted',
    1: 'bg-chart-1',
    2: 'bg-chart-2',
    3: 'bg-chart-3',
    4: 'bg-chart-4',
  };
  return classes[intensity];
}

function uniqueProjects(contributions: DayContribution[]): string[] {
  return [...new Set(contributions.map((c) => c.projectName))];
}

interface ActivityChartProps {
  weeks: ChartWeek[];
  maxContributions: number;
  onDayClick: (date: string, contributions: DayContribution[]) => void;
  className?: string;
  animated?: boolean;
  /** Fullscreen mode: no labels/legend, cells fill the container */
  fullscreen?: boolean;
  scrollTriggerRef?: React.RefObject<HTMLElement | null>;
}

const ActivityChart = ({
  weeks,
  onDayClick,
  className,
  animated = false,
  fullscreen = false,
  scrollTriggerRef,
}: ActivityChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!animated || !containerRef.current) return;

      const cells = containerRef.current.querySelectorAll('.chart-cell');
      if (cells.length === 0) return;

      gsap.set(cells, { opacity: 0, scale: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggerRef?.current ?? containerRef.current,
          start: 'top top',
          end: '+=220%',
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });

      // Animate cells in over the first ~75% of scroll
      tl.to(cells, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        stagger: {
          amount: 1.5,
          from: 'random',
        },
      });

      // Hold for the remaining ~25% so the user can see the finished chart before unpinning
      tl.to({}, { duration: 0.5 });
    },
    { scope: containerRef, dependencies: [animated, weeks] },
  );

  const allDays = weeks.flatMap((week) =>
    week.days.map((day) => ({ ...day, week: week.weekIndex })),
  );

  if (fullscreen) {
    return (
      // Outer div: fills the container and centers the grid
      <div
        ref={containerRef}
        className={cn(
          'absolute inset-0 flex items-center justify-center p-4',
          className,
        )}
      >
        {/* Inner grid: sizes itself via --chart-cell so rows === cols (squares) */}
        <div className="activity-chart-fullscreen grid grid-flow-col gap-1.75">
          {allDays.map((day, i) => (
            <Tooltip key={`${day.date}-${i}`}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'chart-cell rounded-sm cursor-pointer transition-colors hover:ring-1 hover:ring-foreground/30',
                    intensityClass(day.intensity),
                  )}
                  onClick={() => {
                    if (day.contributions.length > 0) {
                      onDayClick(day.date, day.contributions);
                    }
                  }}
                  aria-label={`${day.date}: ${day.contributions.length} contributions`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{day.date}</p>
                <p>
                  {day.contributions.length}{' '}
                  {day.contributions.length === 1
                    ? 'contribution'
                    : 'contributions'}
                </p>
                {day.contributions.length > 0 && (
                  <ul className="mt-1">
                    {uniqueProjects(day.contributions).map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex gap-1">
        <WeekdayLabels />
        <div
          ref={containerRef}
          className="grid grid-rows-7 grid-flow-col gap-0.75"
        >
          {allDays.map((day) => (
            <Tooltip key={day.date}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'chart-cell size-3 sm:size-3.5 rounded-sm cursor-pointer transition-colors hover:ring-1 hover:ring-foreground/30',
                    intensityClass(day.intensity),
                  )}
                  onClick={() => {
                    if (day.contributions.length > 0) {
                      onDayClick(day.date, day.contributions);
                    }
                  }}
                  aria-label={`${day.date}: ${day.contributions.length} contributions`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{day.date}</p>
                <p>
                  {day.contributions.length}{' '}
                  {day.contributions.length === 1
                    ? 'contribution'
                    : 'contributions'}
                </p>
                {day.contributions.length > 0 && (
                  <ul className="mt-1">
                    {uniqueProjects(day.contributions).map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
      <ChartLegend />
    </div>
  );
};

export default ActivityChart;
