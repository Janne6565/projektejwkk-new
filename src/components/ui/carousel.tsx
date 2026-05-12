import * as React from "react"
import useEmblaCarousel, {type UseEmblaCarouselType} from "embla-carousel-react"
import {ChevronLeft, ChevronRight, X} from "lucide-react"
import {cn} from "@/lib/utils"
import {Dialog as DialogPrimitive} from "radix-ui"

type CarouselApi = UseEmblaCarouselType[1]

type Slide = { kind: "image"; src: string } | { kind: "video"; embedUrl: string }

function toYouTubeEmbedUrl(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function useCarousel(options: { loop: boolean }) {
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
        if (!api) return
        setSelectedIndex(api.selectedScrollSnap())
        setCanScrollPrev(api.canScrollPrev())
        setCanScrollNext(api.canScrollNext())
    }, [])

    React.useEffect(() => {
        if (!emblaApi) return
        onSelect(emblaApi)
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
        return () => {
            emblaApi.off("select", onSelect)
            emblaApi.off("reInit", onSelect)
        }
    }, [emblaApi, onSelect])

    return {emblaRef, emblaApi, selectedIndex, canScrollPrev, canScrollNext}
}

function CarouselControls({count, selectedIndex, canScrollPrev, canScrollNext, emblaApi}: {
    count: number
    selectedIndex: number
    canScrollPrev: boolean
    canScrollNext: boolean
    emblaApi: CarouselApi
}) {
    if (count <= 1) return null

    return (
        <>
            <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow backdrop-blur-sm transition hover:bg-background disabled:opacity-30"
            >
                <ChevronLeft className="size-4"/>
            </button>
            <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow backdrop-blur-sm transition hover:bg-background disabled:opacity-30"
            >
                <ChevronRight className="size-4"/>
            </button>

            <div className="mt-2 flex justify-center gap-1.5">
                {Array.from({length: count}, (_, i) => (
                    <button
                        key={i}
                        onClick={() => emblaApi?.scrollTo(i)}
                        className={cn(
                            "size-2 rounded-full transition",
                            i === selectedIndex
                                ? "bg-foreground"
                                : "bg-foreground/25 hover:bg-foreground/50"
                        )}
                    />
                ))}
            </div>
        </>
    )
}

function FullscreenViewer({slides, startIndex, onClose}: {
    slides: Slide[]
    startIndex: number
    onClose: () => void
}) {
    const {emblaRef, emblaApi, selectedIndex, canScrollPrev, canScrollNext} = useCarousel({loop: true})

    React.useEffect(() => {
        if (emblaApi) emblaApi.scrollTo(startIndex, true)
    }, [emblaApi, startIndex])

    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopImmediatePropagation()
                onClose()
            }
            if (e.key === "ArrowLeft") emblaApi?.scrollPrev()
            if (e.key === "ArrowRight") emblaApi?.scrollNext()
        }
        window.addEventListener("keydown", onKeyDown, true)
        return () => window.removeEventListener("keydown", onKeyDown, true)
    }, [emblaApi, onClose])

    return (
        <DialogPrimitive.Root open onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-100 bg-black/90"/>
                <DialogPrimitive.Content
                    className="fixed inset-0 z-100 flex flex-col items-center justify-center outline-none"
                    aria-describedby={undefined}
                    onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}
                >
                    <DialogPrimitive.Title className="sr-only">Image viewer</DialogPrimitive.Title>

                    <DialogPrimitive.Close className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 cursor-pointer">
                        <X className="size-6"/>
                    </DialogPrimitive.Close>

                    <div className="relative w-full max-w-7xl px-16">
                        <div ref={emblaRef} className="overflow-hidden">
                            <div className="flex">
                                {slides.map((slide, i) => (
                                    <div key={i} className="min-w-0 flex-[0_0_100%] flex items-center justify-center">
                                        {slide.kind === "image" ? (
                                            <img
                                                src={slide.src}
                                                alt={`Slide ${i + 1}`}
                                                className="max-h-[90vh] w-auto max-w-full object-contain rounded-md"
                                            />
                                        ) : (
                                            <iframe
                                                src={slide.embedUrl}
                                                className="w-full aspect-video rounded-md max-h-[90vh]"
                                                allowFullScreen
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {slides.length > 1 && (
                            <>
                                <button
                                    onClick={() => emblaApi?.scrollPrev()}
                                    disabled={!canScrollPrev}
                                    className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                                >
                                    <ChevronLeft className="size-6"/>
                                </button>
                                <button
                                    onClick={() => emblaApi?.scrollNext()}
                                    disabled={!canScrollNext}
                                    className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                                >
                                    <ChevronRight className="size-6"/>
                                </button>

                                <div className="mt-4 flex justify-center gap-2">
                                    {slides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => emblaApi?.scrollTo(i)}
                                            className={cn(
                                                "size-2.5 rounded-full transition cursor-pointer",
                                                i === selectedIndex
                                                    ? "bg-white"
                                                    : "bg-white/30 hover:bg-white/60"
                                            )}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}

interface CarouselProps {
    images: string[]
    youtubeUrl?: string
    className?: string
}

export function Carousel({images, youtubeUrl, className}: CarouselProps) {
    const videoSlides: Slide[] = youtubeUrl ? (() => {
        const embedUrl = toYouTubeEmbedUrl(youtubeUrl)
        return embedUrl ? [{kind: "video" as const, embedUrl}] : []
    })() : []

    const slides: Slide[] = [
        ...videoSlides,
        ...images.map(src => ({kind: "image" as const, src})),
    ]

    const {emblaRef, emblaApi, selectedIndex, canScrollPrev, canScrollNext} = useCarousel({loop: true})
    const [fullscreenIndex, setFullscreenIndex] = React.useState<number | null>(null)
    const [loaded, setLoaded] = React.useState(images.length === 0 || !!youtubeUrl)

    return (
        <>
            <div className={cn("relative", className)}>
                {!loaded && (
                    <div className="h-80 w-full rounded-lg bg-muted animate-pulse"/>
                )}
                <div ref={emblaRef} className={cn("overflow-hidden rounded-lg", !loaded && "h-0 overflow-hidden")}>
                    <div className="flex">
                        {slides.map((slide, i) => (
                            <div key={i} className="min-w-0 flex-[0_0_100%] flex items-center justify-center">
                                {slide.kind === "image" ? (
                                    <img
                                        src={slide.src}
                                        alt={`Slide ${i + 1}`}
                                        className="max-h-80 max-w-full h-auto w-auto object-contain cursor-pointer rounded"
                                        onClick={() => setFullscreenIndex(i)}
                                        onLoad={i === videoSlides.length ? () => setLoaded(true) : undefined}
                                    />
                                ) : (
                                    <iframe
                                        src={slide.embedUrl}
                                        className="w-full aspect-video rounded"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <CarouselControls
                    count={slides.length}
                    selectedIndex={selectedIndex}
                    canScrollPrev={canScrollPrev}
                    canScrollNext={canScrollNext}
                    emblaApi={emblaApi}
                />
            </div>

            {fullscreenIndex !== null && (
                <FullscreenViewer
                    slides={slides}
                    startIndex={fullscreenIndex}
                    onClose={() => setFullscreenIndex(null)}
                />
            )}
        </>
    )
}
