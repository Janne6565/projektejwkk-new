import { useMemo, useRef } from 'react';
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

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

interface MonthGroup {
  label: string;
  weeks: ChartWeek[];
}

/** Group weeks by month. A week belongs to the month of its Thursday (ISO convention). */
function groupByMonth(weeks: ChartWeek[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  let current: MonthGroup | null = null;

  for (const week of weeks) {
    // Use Thursday of the week (index 4 = Thu when days start on Sun)
    // or fall back to the first available day
    const refDay = week.days.find((d) => d.dayOfWeek === 4) ?? week.days[0];
    if (!refDay) continue;

    const [y, m] = refDay.date.split('-').map(Number);
    const label = `${SHORT_MONTHS[m - 1]} ${y}`;

    if (!current || current.label !== label) {
      current = { label, weeks: [] };
      groups.push(current);
    }
    current.weeks.push(week);
  }

  return groups;
}

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
      <div
        ref={containerRef}
        className={cn('absolute inset-0', className)}
      >
        <div className="activity-chart-fullscreen grid grid-flow-col gap-0.75 w-full h-full">
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

  const monthGroups = useMemo(() => groupByMonth(weeks), [weeks]);

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex items-end gap-1">
        <WeekdayLabels />
        <div ref={containerRef} className="flex gap-3">
          {monthGroups.map((group) => {
            const groupDays = group.weeks.flatMap((week) =>
              week.days.map((day) => ({ ...day, week: week.weekIndex })),
            );
            return (
              <div key={group.label} className="flex flex-col gap-0.75">
                <span className="text-xs text-muted-foreground truncate">
                  {group.label}
                </span>
                <div className="grid grid-rows-7 grid-flow-col gap-0.75">
                  {groupDays.map((day) => (
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
            );
          })}
        </div>
      </div>
      <ChartLegend />
    </div>
  );
};

export default ActivityChart;
