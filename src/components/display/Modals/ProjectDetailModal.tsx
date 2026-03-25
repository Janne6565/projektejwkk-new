import {useTranslation} from 'react-i18next';
import {useModal} from '@/components/technical/modal-provider';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Badge} from '@/components/ui/badge';
import AdditionalLinks from './AdditionalLinks';
import {toSGA} from '@/lib/sga';
import {totalContributions} from '@/types/project';

function repoName(url: string): string {
    const match = url.match(/github\.com\/(.+)/);
    return match ? match[1] : url;
}

const ProjectDetailModal = () => {
    const {state, close} = useModal();
    const {t, i18n} = useTranslation();

    if (state.type !== 'project') return null;

    const project = state.project;
    const isSGA = i18n.language === 'sga';
    const s = (text: string) => (isSGA ? toSGA(text) : text);
    const description =
        i18n.language === 'de' ? project.descriptionDe : project.descriptionEn;

    return (
        <Dialog open onOpenChange={(open) => !open && close()}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{s(project.name)}</DialogTitle>
                    <DialogDescription>{s(description)}</DialogDescription>
                </DialogHeader>

                {project.contributions.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">
                            {t('projects.repositories')}
                        </h4>
                        <div className="space-y-2">
                            {project.contributions.map((repo) => (
                                <div key={repo.url} className="flex items-center justify-between gap-2 text-sm">
                                    <a
                                        href={repo.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline underline-offset-2 hover:text-foreground truncate"
                                    >
                                        {s(repoName(repo.url))}
                                    </a>
                                    <div className="flex gap-1.5 shrink-0">
                                        {repo.commits > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {repo.commits} {t('projects.detail.commits')}
                                            </Badge>
                                        )}
                                        {repo.pullRequests > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {repo.pullRequests} {t('projects.detail.prs')}
                                            </Badge>
                                        )}
                                        {repo.issues > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {repo.issues} {t('projects.detail.issues')}
                                            </Badge>
                                        )}
                                        {repo.reviews > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {repo.reviews} {t('projects.detail.reviews')}
                                            </Badge>
                                        )}
                                        <Badge variant="secondary" className="text-xs">
                                            {totalContributions(repo)} {t('projects.detail.total')}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <AdditionalLinks info={project.additionalInformation}/>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDetailModal;
