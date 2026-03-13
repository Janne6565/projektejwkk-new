export interface Contribution {
  day: string; // "YYYY-MM-DD"
  type: 'COMMIT' | 'PULL_REQUEST' | 'ISSUE';
  repositoryUrl: string;
  reference: string;
}

export interface AdditionalInformation {
  link?: string;
  appstore?: string;
  playstore?: string;
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
  contributions: Contribution[];
}

export interface Project extends ApiProject {
  contributionCount: number;
  lastContributionDate: string | null;
}
