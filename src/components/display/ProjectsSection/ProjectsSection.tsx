import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectsGrid from '@/components/display/Projects/ProjectsGrid/ProjectsGrid';

const ProjectsSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        {t('projects.gridTitle')}
      </h2>
      <ProjectsGrid sectionRef={sectionRef} />
    </section>
  );
};

export default ProjectsSection;
