export interface RepositoryContribution {
    url: string;
    name: string;
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
}

export interface AdditionalInformation {
    link?: string;
    appstore?: string;
    playstore?: string;
    images?: string;
    youtube?: string;
    technologies?: string;
}

export interface ApiProject {
    uuid: string;
    index: number;
    name: string;
    descriptionEn: string;
    descriptionDe: string;
    description: string | null;
    isVisible: boolean;
    repositories: string[];
    additionalInformation: AdditionalInformation;
    contributions: RepositoryContribution[];
}

export interface Project extends ApiProject {
    contributionCount: number;
    encodedRepositories: string[];
}

export function totalContributions(repo: RepositoryContribution): number {
    return repo.commits + repo.pullRequests + repo.issues + repo.reviews;
}

export function totalContributionsForList(repos: RepositoryContribution[]): number {
    return repos.reduce((sum, r) => sum + totalContributions(r), 0);
}
