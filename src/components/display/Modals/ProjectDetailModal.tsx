import { useTranslation } from 'react-i18next';
import { useModal } from '@/components/technical/modal-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import ProjectContributionChart from './ProjectContributionChart';
import AdditionalLinks from './AdditionalLinks';

function repoName(url: string): string {
  // Extract "user/repo" from a GitHub URL
  const match = url.match(/github\.com\/(.+)/);
  return match ? match[1] : url;
}

const ProjectDetailModal = () => {
  const { state, close } = useModal();
  const { t, i18n } = useTranslation();

  if (state.type !== 'project') return null;

  const project = state.project;
  const description =
    i18n.language === 'de' ? project.descriptionDe : project.descriptionEn;

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {project.contributions.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">
              {t('projects.detail.contributionHistory')}
            </h4>
            <ProjectContributionChart
              contributions={project.contributions}
              projectName={project.name}
              projectUuid={project.uuid}
            />
          </div>
        )}

        {project.repositories.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">{t('projects.repositories')}</h4>
            <div className="flex flex-wrap gap-2">
              {project.repositories.map((repo) => (
                <Badge key={repo} variant="outline" asChild>
                  <a href={`https://${repo}`} target="_blank" rel="noreferrer">
                    {repoName(repo)}
                  </a>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <AdditionalLinks info={project.additionalInformation} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
