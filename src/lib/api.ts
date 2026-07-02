import type { ApiProject, Project } from '@/types/project';
import { totalContributionsForList } from '@/types/project';

const API_BASE =
  process.env.API_BASE_URL ?? 'https://project-manager.jannekeipert.de/api/v1';

const REVALIDATE_SECONDS = 3600;

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE}/projects`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error('Failed to fetch projects');
  const data: ApiProject[] = await response.json();
  return data
    .filter((p) => p.isVisible)
    .sort((a, b) => a.index - b.index)
    .map((p) => ({
      ...p,
      contributionCount: totalContributionsForList(p.contributions),
      encodedRepositories: p.contributions.map((c) => c.url),
    }));
}

export async function getContributionCalendar(): Promise<Record<string, number>> {
  const response = await fetch(`${API_BASE}/contributions/calendar`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error('Failed to fetch calendar');
  return response.json();
}
