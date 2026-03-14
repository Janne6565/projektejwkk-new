import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import ProjectCard from '@/components/display/Projects/ProjectCard/ProjectCard';
import ProjectsLoadingSkeleton from '@/components/display/Projects/ProjectsLoadingSkeleton';
import { useModal } from '@/components/technical/modal-provider';
import useProjects from '@/hooks/use-projects';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsGridProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const ProjectsGrid = ({ sectionRef }: ProjectsGridProps) => {
  const { projects, isLoading } = useProjects();
  const { openProjectModal } = useModal();
  const { t } = useTranslation();
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current || !projects || projects.length === 0) return;

      // Defer one frame so the browser has painted and the hero pin spacer
      // layout is fully settled before ScrollTrigger reads element positions.
      const rafId = requestAnimationFrame(() => {
        if (!gridRef.current) return;

        const cards = Array.from(
          gridRef.current.querySelectorAll<HTMLElement>('.project-card'),
        );
        if (cards.length === 0) return;

        // Recalculate all ScrollTrigger positions to account for the hero
        // section's GSAP pin spacer (~220vh of extra document height).
        ScrollTrigger.refresh();
        gsap.set(cards, { y: 60, opacity: 0 });

        // Scrubbed timeline tied to scroll position. Pin the whole section so
        // the user can scroll through the animation without the content moving.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef?.current ?? gridRef.current,
            start: 'top top',
            end: '+=1200',
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        });

        cards.forEach((card, i) => {
          tl.to(card, { y: 0, opacity: 1, duration: 0.4 }, i * 0.15);
        });

        // Hold after all cards are visible so the user has a noticeable buffer
        // before the section unpins. Needs to be large with scrub:true since
        // there's no inertia to extend the feel (unlike scrub:1 in the hero).
        tl.to({}, { duration: 1.5 });
      });

      return () => cancelAnimationFrame(rafId);
    },
    { scope: gridRef, dependencies: [projects] },
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
