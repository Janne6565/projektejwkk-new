import type enCommon from '../en/common';
import { toSGA } from '@/lib/sga';

type TranslationShape<T> = {
    [K in keyof T]: T[K] extends string ? string : TranslationShape<T[K]>;
};

export default {
    languages: {
        de: 'Deutsch',
        en: 'English',
        la: 'Latin',
        sga: 'ᒷリᓵ⍑ᔑリℸ',
        title: toSGA('Languages'),
    },
    tooltips: {
        logo: toSGA('Welcome to my projects') + ' :)',
        colorScheme: {
            toggle: toSGA('Change colorscheme'),
        },
        languageSelector: toSGA('Change language'),
    },
    projects: {
        heroSubtitle: toSGA('The babblings of'),
        heroTitle: 'Janne Keipert',
        gridTitle: toSGA('Projects'),
        contributions: toSGA('contributions'),
        contributionsSince: toSGA('contributions since'),
        contributionsOnDay: toSGA('contributions on this day'),
        lastActive: toSGA('Last active'),
        liveDemo: toSGA('Live Demo'),
        repos: toSGA('repos'),
        repositories: toSGA('Repositories'),
        appStore: toSGA('App Store'),
        playStore: toSGA('Play Store'),
        visitLink: toSGA('Visit'),
        noProjects: toSGA('No projects found'),
        loading: toSGA('Loading projects') + '...',
        chart: {
            less: toSGA('Less'),
            more: toSGA('More'),
        },
        detail: {
            contributionHistory: toSGA('Contribution History'),
            additionalLinks: toSGA('Links'),
        },
    },
} satisfies TranslationShape<typeof enCommon>;
