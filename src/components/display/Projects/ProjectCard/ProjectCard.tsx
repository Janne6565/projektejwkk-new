import type {Project} from '@/types/project';
import {Card, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {useTranslation} from 'react-i18next';
import {toSGA} from '@/lib/sga';

const ProjectCard = ({
                         project,
                         onClick,
                     }: {
    project: Project;
    onClick: () => void;
}) => {
    const {t, i18n} = useTranslation();
    const isSGA = i18n.language === 'sga';
    const s = (text: string) => (isSGA ? toSGA(text) : text);
    const description =
        i18n.language === 'de' ? project.descriptionDe : project.descriptionEn;

    return (
        <Card
            className="project-card cursor-pointer hover:ring-primary/30 hover:ring-2 transition-all w-full h-60 justify-between"
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle className={"truncate"}>{s(project.name)}</CardTitle>
                <CardDescription className={"truncate line-clamp-6 text-wrap"}>{s(description)}</CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-2">
                <div className="flex items-center gap-2 w-full overflow-x-auto">
                    <Badge variant="secondary">
                        {s(String(project.contributionCount))} {t('projects.contributions')}
                    </Badge>
                    {project.additionalInformation.link && (
                        <Badge variant="outline" asChild>
                            <a
                                href={project.additionalInformation.link}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {t('projects.liveDemo')}
                            </a>
                        </Badge>
                    )}
                    {project.repositories.length > 0 && (
                        <Badge variant="outline" className={"inline"}>
                            {s(String(project.encodedRepositories.length))} {t('projects.repos')}
                        </Badge>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
};

export default ProjectCard;
