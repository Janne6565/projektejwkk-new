import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const intensityClasses = [
  'bg-muted',
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
];

const ChartLegend = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <span>{t('projects.chart.less')}</span>
      {intensityClasses.map((cls, i) => (
        <div key={i} className={cn('size-3 rounded-sm', cls)} />
      ))}
      <span>{t('projects.chart.more')}</span>
    </div>
  );
};

export default ChartLegend;
