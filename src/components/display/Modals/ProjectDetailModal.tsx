import {useTranslation} from 'react-i18next';
import {useModal} from '@/components/technical/modal-provider';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from '@/components/ui/dialog';
import {Badge} from '@/components/ui/badge';
import AdditionalLinks from './AdditionalLinks';
import {toSGA} from '@/lib/sga';
import {Accordion, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import AutoHeightAccordionContent from "@/components/ui/auto-height-accordion-content.tsx";
import {Carousel} from "@/components/ui/carousel.tsx";
import {categorizeTechnologies} from "@/lib/technology-categories.ts";

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

                {project.additionalInformation.images && (() => {
                    const imageList = project.additionalInformation.images.split(",").map(s => s.trim()).filter(Boolean);
                    return imageList.length > 0 ? <Carousel images={imageList}/> : null;
                })()}

                <AdditionalLinks info={project.additionalInformation}/>

                {project.additionalInformation.technologies && (() => {
                    const techs = project.additionalInformation.technologies.split(",").map(t => t.trim()).filter(Boolean);
                    const groups = categorizeTechnologies(techs);
                    return groups.length > 0 ? (
                        <Accordion type={"single"} collapsible>
                            <AccordionItem value={"technologies"}>
                                <AccordionTrigger className={"flex items-center cursor-pointer"}>
                                    <h4 className="font-medium">
                                        {t('projects.technologies')}
                                    </h4>
                                </AccordionTrigger>
                                <AutoHeightAccordionContent className={"pb-5 px-6"} innerClassName={"flex gap-4 flex-col"}>
                                    {groups.map((group) => (
                                        <div key={group.category}>
                                            <p className="text-xs text-muted-foreground mb-1.5">{s(group.category)}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {group.items.map((tech) => (
                                                    <Badge key={tech} variant="secondary" className="text-xs">
                                                        {s(tech)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </AutoHeightAccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ) : null;
                })()}

                {project.contributions.length > 0 && (
                    <Accordion type={"single"} collapsible>
                        <AccordionItem value={"repositories"}>
                            <AccordionTrigger className={"flex items-center cursor-pointer"}>
                                <h4 className="font-medium">
                                    {t('projects.repositories')}
                                </h4>
                            </AccordionTrigger>
                            <AutoHeightAccordionContent className={"pb-5 px-6"} innerClassName={"flex gap-3 flex-col"}>
                                {project.contributions.map((repo) => (
                                    <div key={repo.url} className="flex items-center justify-between gap-4 text-sm">
                                        <a
                                            href={repo.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-muted-foreground hover:text-foreground truncate"
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
                                        </div>
                                    </div>
                                ))}
                            </AutoHeightAccordionContent>
                        </AccordionItem>
                    </Accordion>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDetailModal;
