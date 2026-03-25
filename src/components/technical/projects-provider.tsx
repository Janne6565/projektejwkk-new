import {createContext, type ReactNode} from 'react';
import type {ApiProject, Project} from '@/types/project.ts';
import {totalContributionsForList} from '@/types/project.ts';
import {useQuery} from '@tanstack/react-query';

interface ProjectsContext {
    projects: Project[] | undefined;
    calendar: Record<string, number> | undefined;
    isLoading: boolean;
    error: Error | null;
}

export const ProjectsContext = createContext<ProjectsContext>({
    projects: undefined,
    calendar: undefined,
    isLoading: false,
    error: null,
});

const API_BASE = 'https://project-manager.jannekeipert.de/api/v1';

const ProjectsProvider = (props: { children: ReactNode }) => {
    const {data: projects, isLoading: projectsLoading, error: projectsError} = useQuery({
        queryKey: ['projects'],
        queryFn: async (): Promise<Project[]> => {
            const response = await fetch(`${API_BASE}/projects`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data: ApiProject[] = await response.json();
            return data
                .filter((p) => p.isVisible)
                .sort((a, b) => a.index - b.index)
                .map((p) => ({
                    ...p,
                    contributionCount: totalContributionsForList(p.contributions),
                    encodedRepositories: p.contributions.map(c => c.url),
                }));
        },
        staleTime: 5 * 60 * 1000,
    });

    const {data: calendar, isLoading: calendarLoading, error: calendarError} = useQuery({
        queryKey: ['calendar'],
        queryFn: async (): Promise<Record<string, number>> => {
            const response = await fetch(`${API_BASE}/contributions/calendar`);
            if (!response.ok) throw new Error('Failed to fetch calendar');
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
    });

    return (
        <ProjectsContext.Provider
            value={{
                projects,
                calendar,
                isLoading: projectsLoading || calendarLoading,
                error: (projectsError ?? calendarError) as Error | null,
            }}
        >
            {props.children}
        </ProjectsContext.Provider>
    );
};

export default ProjectsProvider;
