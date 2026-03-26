const categoryDefinitions: [string, string[]][] = [
    ['Languages', [
        'java', 'typescript', 'javascript', 'python', 'rust', 'go', 'php', 'html', 'css',
    ]],
    ['Frameworks', [
        'spring boot', 'spring webflux', 'spring security', 'spring data jpa',
        'react', 'react native', 'vue.js', 'express', 'actix-web', 'gin', 'expo',
        'single-spa', 'docusaurus', 'fumadocs', 'node.js',
    ]],
    ['UI & Styling', [
        'tailwind css', 'radix ui', 'shadcn/ui', 'material ui', 'material ui joy',
        'sass', 'emotion', 'lucide', 'font awesome', 'google fonts',
        'react native paper', 'mui x charts', 'mui x data grid', 'gsap',
    ]],
    ['State & Data Fetching', [
        'redux toolkit', 'redux persist', 'tanstack query', 'tanstack router',
        'axios', 'localforage', 'async storage', 'react hook form', 'orval',
        'stomp', 'sockjs', 'websocket', 'rcon',
    ]],
    ['Database & Storage', [
        'postgresql', 'h2', 'mysql', 'minio', 'influxdb',
    ]],
    ['Auth & Security', [
        'jwt', 'spring oauth2 authorization server', 'oidc-client-ts',
        'spring cloud openfeign', 'keycloak',
    ]],
    ['Build & Tooling', [
        'vite', 'maven', 'gradle', 'bun', 'pnpm', 'biome', 'eslint', 'prettier',
        'checkstyle', 'docker', 'nginx', 'apache',
    ]],
    ['Testing', [
        'vitest', 'testing library', 'jest', 'junit', 'cypress',
    ]],
    ['Infrastructure & DevOps', [
        'kubernetes', 'k3s', 'kustomize', 'traefik', 'argocd', 'ansible',
        'github actions', 'watchtower', 'grafana loki', 'prometheus', 'loki4j',
        'spring actuator', 'spring   actuator', 'micrometer',
    ]],
    ['APIs & Services', [
        'mailgun api', 'steamgriddb api', 'imgur api', 'valorant api',
        'go-github', 'google analytics', 'google adsense', 'openapi', 'springdoc openapi',
    ]],
    ['Libraries', [
        'zod', 'recharts', 'cmdk', 'sonner', 'next-themes', 'embla carousel',
        'react resizable panels', 'dayjs', 'papaparse', 'notistack', 'cal-heatmap',
        'react-markdown', 'i18next', 'react router', 'xyflow', 'html-to-image',
        'dnd-kit', 'bucket4j', 'lombok', 'jackson', 'opencsv', 'pino',
        'fuzzy-search', 'react-code-blocks', 'thymeleaf', 'typst', 'project reactor',
        'flyway', 'viper', 'fabric', 'expo router', 'expo notifications',
        'reanimated', 'moti', 'canvas api', 'pdo', 'apache commons lang',
    ]],
];

const displayNames: Record<string, string> = {
    'java': 'Java',
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'python': 'Python',
    'rust': 'Rust',
    'go': 'Go',
    'php': 'PHP',
    'html': 'HTML',
    'css': 'CSS',
    'spring boot': 'Spring Boot',
    'spring webflux': 'Spring WebFlux',
    'spring security': 'Spring Security',
    'spring data jpa': 'Spring Data JPA',
    'react': 'React',
    'react native': 'React Native',
    'vue.js': 'Vue.js',
    'express': 'Express',
    'actix-web': 'Actix Web',
    'gin': 'Gin',
    'expo': 'Expo',
    'single-spa': 'single-spa',
    'docusaurus': 'Docusaurus',
    'fumadocs': 'Fumadocs',
    'node.js': 'Node.js',
    'tailwind css': 'Tailwind CSS',
    'radix ui': 'Radix UI',
    'shadcn/ui': 'shadcn/ui',
    'material ui': 'Material UI',
    'material ui joy': 'Material UI Joy',
    'sass': 'Sass',
    'emotion': 'Emotion',
    'lucide': 'Lucide',
    'font awesome': 'Font Awesome',
    'google fonts': 'Google Fonts',
    'react native paper': 'React Native Paper',
    'mui x charts': 'MUI X Charts',
    'mui x data grid': 'MUI X Data Grid',
    'gsap': 'GSAP',
    'redux toolkit': 'Redux Toolkit',
    'redux persist': 'Redux Persist',
    'tanstack query': 'TanStack Query',
    'tanstack router': 'TanStack Router',
    'axios': 'Axios',
    'localforage': 'localForage',
    'async storage': 'Async Storage',
    'react hook form': 'React Hook Form',
    'orval': 'Orval',
    'stomp': 'STOMP',
    'sockjs': 'SockJS',
    'websocket': 'WebSocket',
    'rcon': 'RCON',
    'postgresql': 'PostgreSQL',
    'h2': 'H2',
    'mysql': 'MySQL',
    'minio': 'MinIO',
    'influxdb': 'InfluxDB',
    'jwt': 'JWT',
    'spring oauth2 authorization server': 'Spring OAuth2 Authorization Server',
    'oidc-client-ts': 'oidc-client-ts',
    'spring cloud openfeign': 'Spring Cloud OpenFeign',
    'keycloak': 'Keycloak',
    'vite': 'Vite',
    'maven': 'Maven',
    'gradle': 'Gradle',
    'bun': 'Bun',
    'pnpm': 'pnpm',
    'biome': 'Biome',
    'eslint': 'ESLint',
    'prettier': 'Prettier',
    'checkstyle': 'Checkstyle',
    'docker': 'Docker',
    'nginx': 'NGINX',
    'apache': 'Apache',
    'vitest': 'Vitest',
    'testing library': 'Testing Library',
    'jest': 'Jest',
    'junit': 'JUnit',
    'cypress': 'Cypress',
    'kubernetes': 'Kubernetes',
    'k3s': 'K3s',
    'kustomize': 'Kustomize',
    'traefik': 'Traefik',
    'argocd': 'ArgoCD',
    'ansible': 'Ansible',
    'github actions': 'GitHub Actions',
    'watchtower': 'Watchtower',
    'grafana loki': 'Grafana Loki',
    'prometheus': 'Prometheus',
    'loki4j': 'Loki4j',
    'spring actuator': 'Spring Actuator',
    'spring   actuator': 'Spring Actuator',
    'micrometer': 'Micrometer',
    'mailgun api': 'Mailgun API',
    'steamgriddb api': 'SteamGridDB API',
    'imgur api': 'Imgur API',
    'valorant api': 'Valorant API',
    'go-github': 'go-github',
    'google analytics': 'Google Analytics',
    'google adsense': 'Google AdSense',
    'openapi': 'OpenAPI',
    'springdoc openapi': 'SpringDoc OpenAPI',
    'zod': 'Zod',
    'recharts': 'Recharts',
    'cmdk': 'cmdk',
    'sonner': 'Sonner',
    'next-themes': 'next-themes',
    'embla carousel': 'Embla Carousel',
    'react resizable panels': 'React Resizable Panels',
    'dayjs': 'Day.js',
    'papaparse': 'PapaParse',
    'notistack': 'Notistack',
    'cal-heatmap': 'Cal-Heatmap',
    'react-markdown': 'react-markdown',
    'i18next': 'i18next',
    'react router': 'React Router',
    'xyflow': 'xyflow',
    'html-to-image': 'html-to-image',
    'dnd-kit': 'dnd-kit',
    'bucket4j': 'Bucket4j',
    'lombok': 'Lombok',
    'jackson': 'Jackson',
    'opencsv': 'OpenCSV',
    'pino': 'Pino',
    'fuzzy-search': 'fuzzy-search',
    'react-code-blocks': 'react-code-blocks',
    'thymeleaf': 'Thymeleaf',
    'typst': 'Typst',
    'project reactor': 'Project Reactor',
    'flyway': 'Flyway',
    'viper': 'Viper',
    'fabric': 'Fabric',
    'expo router': 'Expo Router',
    'expo notifications': 'Expo Notifications',
    'reanimated': 'Reanimated',
    'moti': 'Moti',
    'canvas api': 'Canvas API',
    'pdo': 'PDO',
    'apache commons lang': 'Apache Commons Lang',
};

const techToCategory = new Map<string, string>();
for (const [category, techs] of categoryDefinitions) {
    for (const tech of techs) {
        techToCategory.set(tech.toLowerCase(), category);
    }
}

const categoryOrder = new Map(categoryDefinitions.map(([cat], i) => [cat, i]));

export interface TechnologyGroup {
    category: string;
    items: string[];
}

export function categorizeTechnologies(technologies: string[]): TechnologyGroup[] {
    const groups = new Map<string, string[]>();

    for (const tech of technologies) {
        const normalized = tech.toLowerCase().trim();
        if (!normalized) continue;
        const category = techToCategory.get(normalized) ?? 'Other';
        const list = groups.get(category) ?? [];
        list.push(displayNames[normalized] ?? tech.trim());
        groups.set(category, list);
    }

    return [...groups.entries()]
        .sort(([a], [b]) => (categoryOrder.get(a) ?? 999) - (categoryOrder.get(b) ?? 999))
        .map(([category, items]) => ({category, items}));
}
