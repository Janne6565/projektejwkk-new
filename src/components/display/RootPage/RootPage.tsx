import { lazy, Suspense } from 'react';
import FloatingHeader from '@/components/display/FloatingHeader/FloatingHeader';
import HeroSection from '@/components/display/HeroSection/HeroSection';
import {ModalProvider} from '@/components/technical/modal-provider';

const ProjectsSection = lazy(() => import('@/components/display/ProjectsSection/ProjectsSection'));
const ModalRoot = lazy(() => import('@/components/display/Modals/ModalRoot'));

const RootPage = () => {
    return (
        <ModalProvider>
            <div className="bg-background w-screen transition-colors min-h-screen">
                <FloatingHeader/>
                <HeroSection/>
                <Suspense>
                    <ProjectsSection/>
                </Suspense>
                <Suspense>
                    <ModalRoot/>
                </Suspense>
            </div>
        </ModalProvider>
    );
};

export default RootPage;
