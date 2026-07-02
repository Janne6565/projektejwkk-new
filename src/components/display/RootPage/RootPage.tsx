'use client';

import FloatingHeader from '@/components/display/FloatingHeader/FloatingHeader';
import HeroSection from '@/components/display/HeroSection/HeroSection';
import ProjectsSection from '@/components/display/ProjectsSection/ProjectsSection';
import ModalRoot from '@/components/display/Modals/ModalRoot';
import type { Project } from '@/types/project';

interface RootPageProps {
  projects: Project[];
  calendar: Record<string, number>;
}

const RootPage = ({ projects, calendar }: RootPageProps) => {
  return (
    <div className="bg-background w-screen transition-colors min-h-screen">
      <FloatingHeader />
      <HeroSection calendar={calendar} />
      <ProjectsSection projects={projects} />
      <ModalRoot />
    </div>
  );
};

export default RootPage;
