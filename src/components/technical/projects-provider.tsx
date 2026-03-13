import { createContext, type ReactNode } from 'react';
import type { ApiProject, Project } from '@/types/project.ts';
import { useQuery } from '@tanstack/react-query';

interface ProjectsContext {
  projects: Project[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const ProjectsContext = createContext<ProjectsContext>({
  projects: undefined,
  isLoading: false,
  error: null,
});

const ProjectsProvider = (props: { children: ReactNode }) => {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const response = await fetch(
        'https://project-manager.jannekeipert.de/api/v1/projects',
      );
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data: ApiProject[] = await response.json();
      return data
        .filter((p) => p.isVisible)
        .sort((a, b) => a.index - b.index)
        .map((p) => {
          const sorted = [...p.contributions].sort((a, b) =>
            b.day.localeCompare(a.day),
          );
          return {
            ...p,
            contributionCount: p.contributions.length,
            lastContributionDate: sorted.length > 0 ? sorted[0].day : null,
          };
        });
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoading,
        error: error as Error | null,
      }}
    >
      {props.children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
