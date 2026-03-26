import FloatingHeader from '@/components/display/FloatingHeader/FloatingHeader';
import HeroSection from '@/components/display/HeroSection/HeroSection';
import ProjectsSection from '@/components/display/ProjectsSection/ProjectsSection';
import ModalRoot from '@/components/display/Modals/ModalRoot';
import {ModalProvider} from '@/components/technical/modal-provider';

const RootPage = () => {
    return (
        <ModalProvider>
            <div className="bg-background w-screen transition-colors min-h-screen">
                <FloatingHeader/>
                <HeroSection/>
                <ProjectsSection/>
                <ModalRoot/>
            </div>
        </ModalProvider>
    );
};

export default RootPage;
