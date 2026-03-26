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
        title: 'Linguae',
    },
    tooltips: {
        logo: 'Salve! Ecce opera mea :)',
        colorScheme: {
            toggle: 'Colorem mutare',
        },
        languageSelector: 'Linguam mutare',
    },
    projects: {
        heroSubtitle: 'Opera et studia',
        heroTitle: 'Janne Keipert',
        gridTitle: 'Opera',
        contributions: 'contributiones',
        contributionsSince: 'contributiones ab',
        contributionsOnDay: 'contributiones hoc die',
        lastActive: 'Novissime activum',
        liveDemo: 'Demonstratio Viva',
        repos: 'repositoria',
        repositories: 'Repositoria',
        appStore: 'App Store',
        playStore: 'Play Store',
        visitLink: 'Visita',
        noProjects: 'Nulla opera inventa',
        error: 'Error in operibus onerandis fuit.',
        loading: 'Opera onerantur...',
        chart: {
            less: 'Minus',
            more: 'Plus',
        },
        detail: {
            contributionHistory: 'Historia Contributionum',
            additionalLinks: 'Nexus',
            commits: 'commits',
            prs: 'PRs',
            issues: 'quaestiones',
            reviews: 'recensiones',
            total: 'summa',
        },
    },
} satisfies TranslationShape<typeof enCommon>;
