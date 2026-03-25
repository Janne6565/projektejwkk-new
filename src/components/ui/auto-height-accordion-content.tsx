import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {type ComponentProps, type ReactNode, useEffect, useRef} from 'react';

function AutoHeightAccordionContent({children, innerClassName, ...props}: {
    children: ReactNode,
    innerClassName?: ComponentProps<"div">['className'],
} & ComponentProps<typeof AccordionPrimitive.Content>) {
    const innerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const inner = innerRef.current;
        const content = contentRef.current;
        if (!inner || !content) return;

        const ro = new ResizeObserver(() => {
            const h = inner.clientHeight;
            content.style.setProperty('--radix-accordion-content-height', `${h}px`);
        });

        ro.observe(inner);
        return () => ro.disconnect();
    }, []);

    return (
        <AccordionPrimitive.Content ref={contentRef} {...props}>
            <div ref={innerRef} className={innerClassName}>{children}</div>
        </AccordionPrimitive.Content>
    );
}

export default AutoHeightAccordionContent;