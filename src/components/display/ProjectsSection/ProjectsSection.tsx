import { useTranslation } from 'react-i18next';
import ProjectsGrid from '@/components/display/Projects/ProjectsGrid/ProjectsGrid';
import type { Project } from '@/types/project';

const ProjectsSection = ({ projects }: { projects: Project[] }) => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        {t('projects.gridTitle')}
      </h2>
      <ProjectsGrid projects={projects} />
    </section>
  );
};

export default ProjectsSection;
