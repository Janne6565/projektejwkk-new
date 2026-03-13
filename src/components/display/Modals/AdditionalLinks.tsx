import { useTranslation } from 'react-i18next';
import type { AdditionalInformation } from '@/types/project';
import { Badge } from '@/components/ui/badge';

const AdditionalLinks = ({ info }: { info: AdditionalInformation }) => {
  const { t } = useTranslation();

  const hasLinks = info.link || info.appstore || info.playstore;
  if (!hasLinks) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {info.link && (
        <Badge variant="outline" asChild>
          <a href={info.link} target="_blank" rel="noreferrer">
            {t('projects.visitLink')}
          </a>
        </Badge>
      )}
      {info.appstore && (
        <Badge variant="outline" asChild>
          <a href={info.appstore} target="_blank" rel="noreferrer">
            {t('projects.appStore')}
          </a>
        </Badge>
      )}
      {info.playstore && (
        <Badge variant="outline" asChild>
          <a href={info.playstore} target="_blank" rel="noreferrer">
            {t('projects.playStore')}
          </a>
        </Badge>
      )}
    </div>
  );
};

export default AdditionalLinks;
