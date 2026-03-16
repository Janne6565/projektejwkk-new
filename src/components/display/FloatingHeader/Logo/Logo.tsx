import TooltipWrapper from '@/components/ui/tooltip-wrapper.tsx';
import {SiGithub} from '@icons-pack/react-simple-icons';
import {Button} from '@/components/ui/button.tsx';

const Logo = () => {
    const openGithub = () => window.open('https://github.com/janne6565');

    return (
        <TooltipWrapper tooltip={'GitHub: janne6565'}>
            <Button variant={'outline'} className={'w-auto h-auto py-2 gap-3 bg-background/80 backdrop-blur-sm'}
                    onClick={openGithub}>
                <SiGithub color={'var(--color-gray-100)'} className={'transition-colors'}/>
                <p>janne6565</p>
            </Button>
        </TooltipWrapper>
    );
};

export default Logo;
