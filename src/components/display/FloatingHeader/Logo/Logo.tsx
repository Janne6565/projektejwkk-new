import TooltipWrapper from '@/components/ui/tooltip-wrapper';
import {SiGithub} from '@icons-pack/react-simple-icons';
import {Button} from '@/components/ui/button';
import {useTranslation} from "react-i18next";
import {toSGA} from "@/lib/sga";

const Logo = () => {
    const openGithub = () => window.open('https://github.com/janne6565');
    const {i18n} = useTranslation();
    const text = i18n.language === 'sga' ? toSGA('janne6565') : 'janne6565';
    return (
        <TooltipWrapper tooltip={'GitHub: janne6565'}>
            <Button variant={'outline'} className={'w-auto h-auto py-2 gap-3 bg-background/80 backdrop-blur-sm'}
                    onClick={openGithub}>
                <SiGithub color={'var(--color-gray-100)'} className={'transition-colors'}/>
                <p>{text}</p>
            </Button>
        </TooltipWrapper>
    );
};

export default Logo;
