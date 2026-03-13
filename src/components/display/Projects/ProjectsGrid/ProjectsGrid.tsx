import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useProjects from '@/hooks/use-projects';
import { useModal } from '@/components/technical/modal-provider';
import ProjectCard from '@/components/display/Projects/ProjectCard/ProjectCard';
import ProjectsLoadingSkeleton from '@/components/display/Projects/ProjectsLoadingSkeleton';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const ProjectsGrid = () => {
  const { projects, isLoading } = useProjects();
  const { openProjectModal } = useModal();
  const { t } = useTranslation();
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current || !projects?.length) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        '.project-card',
        gridRef.current,
      );
      if (cards.length === 0) return;

      gsap.set(cards, {
        y: 48,
        opacity: 0,
      });

      const animation = gsap.timeline({ paused: true });

      animation.to(cards, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: {
          each: 0.12,
          from: 'start',
        },
        ease: 'none',
        overwrite: 'auto',
      });

      const trigger = ScrollTrigger.create({
        trigger: gridRef.current,
        start: 'top 68%',
        end: 'bottom 45%',
        scrub: 1,
        animation,
        invalidateOnRefresh: true,
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        trigger.kill();
        animation.kill();
      };
    },
    { scope: gridRef, dependencies: [projects], revertOnUpdate: true },
  );

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
      {projects.map((project) => (
        <ProjectCard
          key={project.uuid}
          project={project}
          onClick={() => openProjectModal(project)}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
