import { useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ChartWeek, DayCell } from '@/types/contribution-chart';
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

interface ActivityChartProps {
  weeks: ChartWeek[];
  maxContributions: number;
  onDayClick: (date: string, count: number) => void;
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

      tl.to(cells, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        stagger: {
          amount: 1.5,
          from: 'random',
        },
      });

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
                    if (day.count > 0) {
                      onDayClick(day.date, day.count);
                    }
                  }}
                  aria-label={`${day.date}: ${day.count} contributions`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{day.date}</p>
                <p>
                  {day.count}{' '}
                  {day.count === 1 ? 'contribution' : 'contributions'}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }

  // Split boundary weeks into per-month columns
  const displayWeeks = useMemo(() => {
    const raw: { key: string; month: number; year: number; slots: (DayCell | null)[] }[] = [];

    for (const week of weeks) {
      const byMonth = new Map<string, { m: number; y: number; days: DayCell[] }>();
      for (const day of week.days) {
        const [y, m] = day.date.split('-').map(Number);
        const key = `${y}-${m}`;
        if (!byMonth.has(key)) byMonth.set(key, { m, y, days: [] });
        byMonth.get(key)!.days.push(day);
      }
      const groups = Array.from(byMonth.values()).sort((a, b) =>
        a.y !== b.y ? a.y - b.y : a.m - b.m,
      );
      for (const { m, y, days } of groups) {
        const slots: (DayCell | null)[] = Array(7).fill(null);
        for (const day of days) slots[day.dayOfWeek] = day;
        raw.push({ key: `${week.weekIndex}-${y}-${m}`, month: m, year: y, slots });
      }
    }

    return raw.map((w, i) => ({
      ...w,
      isNewMonth: i === 0 || w.month !== raw[i - 1].month || w.year !== raw[i - 1].year,
      label: `${SHORT_MONTHS[w.month - 1]} ${w.year}`,
    }));
  }, [weeks]);

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex items-end gap-1">
        <WeekdayLabels />
        <div ref={containerRef} className="flex gap-0.75">
          {displayWeeks.map((week, i) => (
            <div
              key={week.key}
              className={cn(
                'flex flex-col gap-0.75',
                week.isNewMonth && i > 0 && 'ml-2',
              )}
            >
              <span className={cn('text-xs text-muted-foreground h-4 leading-4 whitespace-nowrap overflow-visible w-0', !week.isNewMonth && 'invisible')}>
                {week.label}
              </span>
              <div className="grid grid-rows-7 gap-0.75">
                {week.slots.map((day, row) =>
                  day ? (
                    <Tooltip key={day.date}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            'chart-cell size-3 sm:size-3.5 rounded-sm cursor-pointer transition-colors hover:ring-1 hover:ring-foreground/30',
                            intensityClass(day.intensity),
                          )}
                          onClick={() => {
                            if (day.count > 0) {
                              onDayClick(day.date, day.count);
                            }
                          }}
                          aria-label={`${day.date}: ${day.count} contributions`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{day.date}</p>
                        <p>
                          {day.count}{' '}
                          {day.count === 1
                            ? 'contribution'
                            : 'contributions'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={row} className="size-3 sm:size-3.5" />
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ChartLegend />
    </div>
  );
};

export default ActivityChart;
