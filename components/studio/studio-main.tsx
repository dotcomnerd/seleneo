'use client'

import useAutomaticAspectRatioSwitcher from '@/hooks/canvas-area-hooks/use-automatic-aspect-ratio-switcher'
import useCanvasResizeObserver from '@/hooks/canvas-area-hooks/use-resize-observer'
import useScreenSizeWarningToast from '@/hooks/canvas-area-hooks/use-screen-size-warning-toast'
import { useEventListener } from '@/hooks/use-event-listener'
import { useBackgroundOptions } from '@/store/use-background-options'
import { useDrawingTools } from '@/store/use-drawing'
import { useImageOptions, useSelectedLayers } from '@/store/use-image-options'
import { useMoveable } from '@/store/use-moveable'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import dynamic from 'next/dynamic'
import React, { CSSProperties, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { BackgroundImageCanvas } from './bg-image'
import { toast } from 'sonner'

const MoveableComponent = dynamic(() => import('./moveable-component'), {
    ssr: false
})

const ImageUpload = dynamic(() => import('./main-image'), {
    ssr: false
})

const MobileViewImageOptions = dynamic(() => import('./mobile-view-image-options'), {
    ssr: false
})

const SelectoComponent = dynamic(() => import('./selecto-component'), {
    ssr: false
})

const TextLayers = dynamic(() => import('./text-layers'), {
    ssr: false
})

const TiptapMoveable = dynamic(() => import('./tiptap-moveable'), {
    ssr: false
})

const DrawingCanvas = dynamic(() => import('./drawing/drawing-canvas'), {
    ssr: false
})

const DrawingMoveable = dynamic(() => import('./drawing/drawing-moveable'), {
    ssr: false
})

export default function Canvas() {
    const {
        backgroundType,
        setBackground,
        setBackgroundType,
        setImageBackground,
        setNoise,
        setGradientAngle,
        setSolidColor,
        setAttribution,
        setHighResBackground,
        setIsBackgroundClicked,
    } = useBackgroundOptions()
    const {
        resolution,
        exactDomResolution,
        scrollScale,
        setScrollScale,
        canvasRoundness,
        setResolution,
        setCanvasRoundness,
        setAutomaticResolution,
    } = useResizeCanvas()
    const {
        scale,
        setScale,
        setImages,
        setInitialImageUploaded,
        setTexts,
    } = useImageOptions()
    const {
        selectedImage,
        selectedText,
        setSelectedImage,
        enableCrop,
        setSelectedText,
    } = useSelectedLayers()
    const screenshotRef = useRef<HTMLDivElement | null>(null)
    const parentRef = useRef<HTMLDivElement | null>(null)
    const {
        showControls,
        setShowControls,
        setShowTextControls,
        setIsMultipleTargetSelected,
        showTextControls,
        isEditable,
        setIsEditable,
        isSelecting,
    } = useMoveable()
    const [width, height]: number[] = resolution.split('x').map(Number)
    const aspectRatio = width / height
    const { currentTool, isDrawing } = useDrawingTools()

    let style: CSSProperties = {
        aspectRatio,
        backgroundImage: `var(--gradient-bg)`,
        borderRadius: `${canvasRoundness * 16}px`,
    }

    if (backgroundType === 'mesh') {
        style = {
            ...style,
            backgroundColor: `var(--mesh-bg)`,
        }
    }

    if (backgroundType === 'solid') {
        style = {
            ...style,
            backgroundColor: `var(--solid-bg)`,
        }
    }

    useCanvasResizeObserver(screenshotRef)
    useAutomaticAspectRatioSwitcher({
        containerRef: parentRef,
        screenshotRef,
    })
    useScreenSizeWarningToast()

    // TODO: move to utils function, but like im too lazy rn
    const restoreIfDefined = (
        value: any,
        setter: (value: any) => void
    ) => {
        if (value !== undefined && value !== null) {
            setter(value)
        }
    }

    const restoreBackgroundVars = (bgType: string, backgroundColor: string) => {
        switch (bgType) {
            case 'solid':
                document?.documentElement.style.setProperty('--solid-bg', backgroundColor)
                document?.documentElement.style.setProperty('--gradient-bg', backgroundColor)
                document?.documentElement.style.setProperty('--mesh-bg', backgroundColor)
                break
            case 'gradient':
                document?.documentElement.style.setProperty('--gradient-bg', backgroundColor)
                break
            case 'mesh':
                document?.documentElement.style.setProperty('--mesh-bg', backgroundColor)
                break
        }
    }

    const loadGoogleFont = (fontFamily: string) => {
        if (typeof window === 'undefined') return
        const existingLink = document.querySelector(
            `link[href*="${fontFamily.replace(/\s+/g, '+')}" ]`
        ) as HTMLLinkElement | null
        if (existingLink) return
        const link = document.createElement('link')
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@200;300;400;500;600;700;800&display=swap`
        link.rel = 'stylesheet'
        document.head.appendChild(link)
    }

    const restoreLocalCanvasState = async () => {
        try {
            if (typeof window === 'undefined') return
            const canvasState = localStorage.getItem('canvasState')
            if (canvasState === null) {
                toast.error('No local save found')
                return
            }

            const { images: savedImages, texts: savedTexts, backgroundSettings, canvasSettings } = JSON.parse(canvasState)

            if (savedImages && savedImages.length > 0) {
                setImages([...savedImages])
                setInitialImageUploaded(true)
            }

            if (savedTexts && savedTexts.length > 0) {
                setTexts([...savedTexts])
                savedTexts.forEach((text: any) => {
                    if (text.style?.fontFamily && text.style.fontFamily !== 'Inter') {
                        loadGoogleFont(text.style.fontFamily)
                    }
                })
            }

            if (backgroundSettings) {
                restoreIfDefined(backgroundSettings.backgroundColor, setBackground)
                restoreIfDefined(backgroundSettings.imageBackground, setImageBackground)
                restoreIfDefined(backgroundSettings.noise, setNoise)
                restoreIfDefined(backgroundSettings.gradientAngle, setGradientAngle)
                restoreIfDefined(backgroundSettings.solidColor, setSolidColor)
                restoreIfDefined(backgroundSettings.attribution, setAttribution)
                restoreIfDefined(backgroundSettings.highResBackground, setHighResBackground)
                restoreIfDefined(backgroundSettings.isBackgroundClicked, setIsBackgroundClicked)
                if (backgroundSettings.backgroundType) restoreIfDefined(backgroundSettings.backgroundType, setBackgroundType)
                if (backgroundSettings.backgroundColor && backgroundSettings.backgroundType) {
                    restoreBackgroundVars(backgroundSettings.backgroundType, backgroundSettings.backgroundColor)
                }
            }

            if (canvasSettings) {
                restoreIfDefined(canvasSettings.scale, setScale)
                restoreIfDefined(canvasSettings.resolution, setResolution)
                restoreIfDefined(canvasSettings.canvasRoundness, setCanvasRoundness)
                restoreIfDefined(canvasSettings.scrollScale, setScrollScale)
                restoreIfDefined(canvasSettings.automaticResolution, setAutomaticResolution)
            }

            toast.success('Local State Restored Successfully')
        } catch (error) {
            toast.error('Failed to restore local state')
        }
    }

    useEffect(() => {
        if (typeof window === 'undefined') return
        const hasLocal = localStorage.getItem('canvasState') !== null
        if (!hasLocal) return
        
        // probably a better way to do this
        const timer = setTimeout(() => {
            toast.custom((t) => (
            <div className="pointer-events-auto z-[60] flex max-w-sm items-start gap-3 rounded-md border bg-background p-3 shadow-lg">
                <div className="flex-1">
                    <p className="text-sm font-medium">Restore your previous design?</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">We found a canvas you saved. Do you want to load it?</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:opacity-90"
                        onClick={() => {
                            restoreLocalCanvasState()
                            toast.dismiss(t)
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="rounded-md border px-2 py-1 text-xs hover:bg-accent"
                        onClick={() => toast.dismiss(t)}
                    >
                        No
                    </button>
                </div>
            </div>
        ), { position: 'top-right' })
        }, 100)
        
        return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
            return
        }
        if (enableCrop) return
        if (e.deltaY < 0) {
            if (scrollScale === 1) return
            setScrollScale(scrollScale + 0.1)
        } else if (e.deltaY > 0) {
            if (scrollScale <= 0.4) return
            setScrollScale(scrollScale - 0.1)
        }
    }

    const parentScaleStyle = {
        scale: `${scrollScale}`,
    }

    useHotkeys('Escape', () => {
        if (showControls) {
            setShowControls(false)
            setIsMultipleTargetSelected(false)
        }
    })

    useEventListener(
        'click',
        (e: any) => {
            const isCanvasArea =
                e?.target?.classList?.contains('canvas-container') ||
                e?.target?.classList?.contains('selecto-area')

            if (isCanvasArea) {
                setSelectedText(null)
                setShowTextControls(false)
                setShowTextControls(false)
                setIsEditable(false)
            }

            if (isSelecting || (!selectedImage && !showControls)) return
            if (isCanvasArea) {
                setSelectedImage(null)
                setShowTextControls(false)
                setShowControls(false)
                setIsMultipleTargetSelected(false)
            }
        },
        screenshotRef
    )

    return (
        <>
            <section
                ref={parentRef}
                className={`relative flex h-full w-full flex-col overflow-hidden dark:bg-zinc-950 bg-gray-200 md:grid md:place-items-center ${aspectRatio <= 1 ? 'p-4 md:p-8' : 'p-4 md:p-8'}`}
                style={parentScaleStyle}
                onWheel={handleScroll}
            >
                <div
                    className={`canvas-container relative flex items-center justify-center overflow-hidden ${aspectRatio <= 1 ? 'h-auto w-full lg:h-full lg:w-auto' : 'h-auto w-full'}`}
                    ref={screenshotRef}
                    id="canvas-container"
                    style={style}
                >
                    <BackgroundImageCanvas />
                    {showControls && <MoveableComponent id={`${selectedImage}`} />}
                    {showTextControls && !isEditable && (
                        <TiptapMoveable id={`text-${selectedText}`} />
                    )}

                    <div
                        className={`selecto-area relative flex h-full w-full place-items-center items-center justify-center ${currentTool !== 'select' || isDrawing ? 'no-user-select' : ''}`}
                        style={{
                            scale,
                            userSelect: currentTool !== 'select' || isDrawing ? 'none' : 'auto',
                            WebkitUserSelect: currentTool !== 'select' || isDrawing ? 'none' as const : 'auto' as const,
                        }}
                    >
                        <ImageUpload />
                        <TextLayers />
                        <DrawingCanvas />
                        <DrawingMoveable />
                    </div>
                </div>
                <MobileViewImageOptions />
            </section>
            <SelectoComponent />
        </>
    )
}