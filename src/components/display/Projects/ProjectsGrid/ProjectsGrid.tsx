import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectCard from '@/components/display/Projects/ProjectCard/ProjectCard';
import ProjectsLoadingSkeleton from '@/components/display/Projects/ProjectsLoadingSkeleton';
import { useModal } from '@/components/technical/modal-provider';
import useProjects from '@/hooks/use-projects';

const ProjectsGrid = () => {
  const { projects, isLoading } = useProjects();
  const { openProjectModal } = useModal();
  const { t } = useTranslation();
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!gridRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [projects]);

  if (isLoading) return <ProjectsLoadingSkeleton />;
  if (!projects || projects.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        {t('projects.noProjects')}
      </p>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto"
    >
      {projects.map((project, i) => (
        <div
          key={project.uuid}
          className="transition-all duration-1000 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: `${i * 100}ms`,
          }}
        >
          <ProjectCard
            project={project}
            onClick={() => openProjectModal(project)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectsGrid;
