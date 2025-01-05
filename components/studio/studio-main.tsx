'use client'

import useAutomaticAspectRatioSwitcher from '@/hooks/canvas-area-hooks/use-automatic-aspect-ratio-switcher'
import useCanvasResizeObserver from '@/hooks/canvas-area-hooks/use-resize-observer'
import useScreenSizeWarningToast from '@/hooks/canvas-area-hooks/use-screen-size-warning-toast'
import { useEventListener } from '@/hooks/use-event-listener'
import { useBackgroundOptions } from '@/store/use-background-options'
import { useImageOptions, useSelectedLayers } from '@/store/use-image-options'
import { useMoveable } from '@/store/use-moveable'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import dynamic from 'next/dynamic'
import React, { CSSProperties, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { BackgroundImageCanvas } from './bg-image'

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

export default function Canvas() {
    const { backgroundType } = useBackgroundOptions()
    const {
        resolution,
        exactDomResolution,
        scrollScale,
        setScrollScale,
        canvasRoundness,
    } = useResizeCanvas()
    const { scale } = useImageOptions()
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
                        className="selecto-area relative flex h-full w-full place-items-center items-center justify-center"
                        style={{
                            scale,
                        }}
                    >
                        <ImageUpload />
                        <TextLayers />
                    </div>
                </div>
                <MobileViewImageOptions />
            </section>
            <SelectoComponent />
        </>
    )
}