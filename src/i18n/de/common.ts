import type enCommon from '../en/common';

type TranslationShape<T> = {
    [K in keyof T]: T[K] extends string ? string : TranslationShape<T[K]>;
};

export default {
    languages: {
        de: 'Deutsch',
        en: 'English',
        la: 'Latin',
        sga: 'Minecraft',
        title: 'Sprachen',
    },
    tooltips: {
        logo: 'Willkommen zu meinen Projekten :)',
        colorScheme: {
            toggle: 'Farbschema wechseln',
        },
        languageSelector: 'Sprache wechseln',
    },
    projects: {
        heroSubtitle: 'Die Zeitvertreibe des',
        heroTitle: 'Janne Keipert',
        gridTitle: 'Projekte',
        contributions: 'Beiträge',
        contributionsSince: 'Beiträge seit',
        contributionsOnDay: 'Beiträgee an diesem Tag',
        lastActive: 'Zuletzt aktiv',
        liveDemo: 'Live Demo',
        repos: 'Repos',
        repositories: 'Repositories',
        technologies: 'Technologien',
        appStore: 'App Store',
        playStore: 'Play Store',
        visitLink: 'Besuchen',
        noProjects: 'Keine Projekte gefunden',
        error: 'Beim Laden der Projekte ist ein Fehler aufgetreten.',
        loading: 'Projekte werden geladen...',
        chart: {
            less: 'Weniger',
            more: 'Mehr',
        },
        detail: {
            contributionHistory: 'Beitragsverlauf',
            additionalLinks: 'Links',
            commits: 'Commits',
            prs: 'PRs',
            issues: 'Issues',
            reviews: 'Reviews',
            total: 'Gesamt',
        },
    },
} satisfies TranslationShape<typeof enCommon>;
