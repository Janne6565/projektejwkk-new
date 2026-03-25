import {useRef} from 'react';
import {ChevronDown} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import StarSky from '@/components/display/StarSky/StarSky';
import {useStarContributions} from '@/hooks/use-star-contributions';
import useProjects from '@/hooks/use-projects';

const HeroSection = () => {
    const {calendar, isLoading} = useProjects();
    const {stars, uniqueDates, earliestDate, totalContributions, isReady} =
        useStarContributions(calendar);
    const {t} = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={sectionRef}
            className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background"
        >
            {!isLoading && isReady && (
                <StarSky
                    stars={stars}
                    uniqueDates={uniqueDates}
                    earliestDate={earliestDate}
                    totalContributions={totalContributions}
                    scrollTriggerRef={sectionRef}
                />
            )}

            <div className={"max-w-[80vw] md:max-w-[unset] mb-[3vw]"}>
                <h2 className={'text-2xl opacity-90 font-bold text-center mb-2 '}>
                    {t('projects.heroSubtitle')}
                </h2>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center z-10 drop-shadow-lg">
                    {t('projects.heroTitle')}
                </h1>
            </div>

            <button
                type="button"
                className="absolute bottom-8 animate-bounce z-10 cursor-pointer"
                onClick={() => {
                    // The hero is pinned for 300vh by ScrollTrigger.
                    // Scroll past the full pinned region to land on the next section.
                    window.scrollTo({
                        top: window.innerHeight * 4,
                        behavior: 'smooth',
                    });
                }}
                aria-label="Scroll to projects"
            >
                <ChevronDown className="size-8 text-muted-foreground -mb-6"/>
                <ChevronDown className="size-8 text-muted-foreground"/>
            </button>
        </section>
    );
};

export default HeroSection;
