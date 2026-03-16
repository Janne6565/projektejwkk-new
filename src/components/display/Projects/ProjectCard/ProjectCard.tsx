import type { Project } from '@/types/project';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { toSGA } from '@/lib/sga';

const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  const { t, i18n } = useTranslation();
  const isSGA = i18n.language === 'sga';
  const s = (text: string) => (isSGA ? toSGA(text) : text);
  const description =
    i18n.language === 'de' ? project.descriptionDe : project.descriptionEn;

  return (
    <Card
      className="project-card cursor-pointer hover:ring-primary/30 hover:ring-2 transition-all w-full"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{s(project.name)}</CardTitle>
        <CardDescription>{s(description)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">
            {s(String(project.contributionCount))} {t('projects.contributions')}
          </Badge>
          {project.lastContributionDate && (
            <span className="text-xs text-muted-foreground">
              {t('projects.lastActive')}: {s(project.lastContributionDate)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">
        {project.additionalInformation.link && (
          <Badge variant="outline" asChild>
            <a
              href={project.additionalInformation.link}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {t('projects.liveDemo')}
            </a>
          </Badge>
        )}
        {project.repositories.length > 0 && (
          <Badge variant="outline">
            {s(String(project.repositories.length))} {t('projects.repos')}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
