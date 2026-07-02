import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectCard from '@/components/display/Projects/ProjectCard/ProjectCard';
import { useModal } from '@/components/technical/modal-provider';
import type { Project } from '@/types/project';

const AnimatedGrid = ({ projects }: { projects: Project[] }) => {
  const { openProjectModal } = useModal();
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!gridRef.current) return;

    const el = gridRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  const { t } = useTranslation();

  if (!projects || projects.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        {t('projects.noProjects')}
      </p>
    );
  }

  return <AnimatedGrid projects={projects} />;
};

export default ProjectsGrid;
