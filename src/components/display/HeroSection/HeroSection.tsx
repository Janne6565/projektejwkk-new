import {lazy, Suspense} from 'react';
import {ChevronDown} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {useStarContributions} from '@/hooks/use-star-contributions';
import useProjects from '@/hooks/use-projects';

const StarSky = lazy(() => import('@/components/display/StarSky/StarSky'));

const HeroSection = () => {
    const {calendar, isLoading} = useProjects();
    const {stars, uniqueDates, earliestDate, totalContributions, isReady} =
        useStarContributions(calendar);
    const {t} = useTranslation();

    return (
        <section
            className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background"
        >
            <div className="absolute inset-0 pointer-events-none z-10" style={{background: 'radial-gradient(ellipse at center, transparent 65%, var(--background) 100%)'}}/>
            {(isLoading || !isReady) && (
                <div className="absolute bottom-27 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none select-none space-y-3">
                    <div className="h-5 w-48 bg-muted animate-pulse rounded-full mx-auto"/>
                    <div className="h-8 w-64 bg-muted animate-pulse rounded-full mx-auto"/>
                </div>
            )}
            {!isLoading && isReady && (
                <Suspense>
                    <div className="animate-in fade-in-0 duration-700">
                        <StarSky
                            stars={stars}
                            uniqueDates={uniqueDates}
                            earliestDate={earliestDate}
                            totalContributions={totalContributions}
                        />
                    </div>
                </Suspense>
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
                    window.scrollTo({
                        top: window.innerHeight,
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
