"use client";

import { Button } from '@/components/ui/button';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useBackgroundOptions } from '@/store/use-background-options';
import { useColorExtractor } from '@/store/use-color-extractor';
import { useImageOptions, useSelectedLayers } from '@/store/use-image-options';
import { useMoveable } from '@/store/use-moveable';
import { useResizeCanvas } from '@/store/use-resize-canvas';
import {
    BringToFront,
    CropIcon,
    ImagePlus,
    SendToBack,
    Trash,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { ChangeEvent, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { toast } from 'sonner';

const DynamicCropComponent = dynamic(() =>
    import('react-image-crop').then((mod) => mod.ReactCrop)
)

export default function ContextMenuImage({
    children,
}: {
    children: React.ReactNode
}) {
    const [crop, setCrop] = useState<Crop>({
        unit: '%', // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50,
    })
    const imgRef = useRef<HTMLImageElement>(null)
    const { setImages, images, texts, scale } = useImageOptions()
    const { selectedImage, setSelectedImage, setEnableCrop, enableCrop } =
        useSelectedLayers()
    const { showControls, setShowControls } = useMoveable()
    const { background, imageBackground, backgroundType, noise, gradientAngle, solidColor, attribution, highResBackground, isBackgroundClicked } = useBackgroundOptions()
    const { resolution, canvasRoundness, scrollScale, automaticResolution } = useResizeCanvas()


    const handleImageDelete = () => {
        if (images.length === 1) {
            setImages([])
            setSelectedImage(null)
            return
        }

        if (selectedImage) {
            const newImages = images.filter((image) => image.id !== selectedImage)
            setImages(newImages)
        }

        setSelectedImage(null)
    }

    const bringToFrontOrBack = (direction: 'front' | 'back') => {
        if (selectedImage) {
            setImages(
                images.map((image) =>
                    image.id === selectedImage
                        ? {
                            ...image,
                            style: {
                                ...image.style,
                                zIndex:
                                    direction === 'front'
                                        ? image.style.zIndex + 1
                                        : image.style.zIndex - 1,
                            },
                        }
                        : image
                )
            )
        }
    }

    // TODO: make hotkeys use ts-key-enum
    useHotkeys('Delete', () => {
        if (selectedImage)
            if (showControls) {
                handleImageDelete()
                setShowControls(false)
                setSelectedImage(null)
            }
    })

    // TODO: potentially move this to the correct place? but for now we can leave it here
    useHotkeys('Backspace', () => {
        if (selectedImage) {
            handleImageDelete()
            setShowControls(false)
            setSelectedImage(null)
        }
    })

    useHotkeys(['ctrl+shift+s', 'meta+shift+s'], () => {
        if (images.length === 0) {
            toast.error('Cannot Save Empty Canvas', { position: 'top-left' })
            return
        }

        const canvasState = {
            images: images,
            texts: texts,
            backgroundSettings: {
                backgroundColor: background,
                backgroundType: backgroundType,
                imageBackground: imageBackground,
                noise: noise,
                gradientAngle: gradientAngle,
                solidColor: solidColor,
                attribution: attribution,
                highResBackground: highResBackground,
                isBackgroundClicked: isBackgroundClicked,
            },
            canvasSettings: {
                scale: scale,
                resolution: resolution,
                canvasRoundness: canvasRoundness,
                scrollScale: scrollScale,
                automaticResolution: automaticResolution,
            },
        }

        localStorage.setItem('canvasState', JSON.stringify(canvasState))

        toast.success('Current State Saved Locally', { position: 'top-left' })
    })

    const cropImageNow = () => {
        if (typeof window === 'undefined') return;
        const canvas = document?.createElement('canvas')
        const image = imgRef.current
        if (!image) return
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d') as CanvasRenderingContext2D // hacky

        const pixelRatio = window.devicePixelRatio
        canvas.width = crop.width * pixelRatio * scaleX
        canvas.height = crop.height * pixelRatio * scaleY
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        ctx.imageSmoothingQuality = 'high'

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        )

        const base64Image = canvas.toDataURL('image/png')
        selectedImage &&
            setImages(
                images.map((image) =>
                    image.id === selectedImage
                        ? {
                            ...image,
                            image: base64Image,
                        }
                        : image
                )
            )
    }

    return (
        <Dialog
            open={enableCrop}
            onOpenChange={(open) => {
                if (open === false) setEnableCrop(false)
                setEnableCrop(open)
            }}
        >
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    <ContextMenuItem
                        inset
                        onClick={() => {
                            bringToFrontOrBack('back')
                        }}
                        disabled={
                            !selectedImage ||
                            !images.find(image => image.id === selectedImage) ||
                            images.find(image => image.id === selectedImage)?.style.zIndex === 2
                        }
                    >
                        Send back
                        <ContextMenuShortcut>
                            <BringToFront size={19} className="opacity-80" />
                        </ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem
                        inset
                        onClick={() => {
                            bringToFrontOrBack('front')
                        }}
                    >
                        Bring forward
                        <ContextMenuShortcut>
                            <SendToBack size={19} className="opacity-80" />
                        </ContextMenuShortcut>
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    <ReplaceImage />

                    <ContextMenuSub>
                        <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-48">
                            <DialogTrigger asChild>
                                <ContextMenuItem
                                    onClick={() => {
                                        setEnableCrop(true)
                                    }}
                                >
                                    Crop
                                    <ContextMenuShortcut>
                                        <CropIcon size={19} className="opacity-80" />
                                    </ContextMenuShortcut>
                                </ContextMenuItem>
                            </DialogTrigger>
                            {/* <ContextMenuItem>...</ContextMenuItem>
                            <ContextMenuItem>...</ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem>...</ContextMenuItem> */}
                        </ContextMenuSubContent>
                    </ContextMenuSub>

                    <ContextMenuSeparator />
                    <ContextMenuItem
                        inset
                        onClick={() => {
                            selectedImage && handleImageDelete()
                        }}
                        className="text-[#F46567]/70 focus:text-[#f46567]/80"
                    >
                        Delete
                        <ContextMenuShortcut>
                            <Trash size={19} className="text-[#F46567]/70 opacity-80" />
                        </ContextMenuShortcut>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <DialogContent className="flex h-fit max-h-[95vh]  w-1/2 flex-col gap-4">
                <DialogHeader className="mb-4">
                    <DialogTitle>Crop image</DialogTitle>
                </DialogHeader>

                <div className="mb-4 h-full w-full flex-1 overflow-hidden overflow-y-auto">
                    {selectedImage && (
                        <DynamicCropComponent
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            disabled={!enableCrop || !selectedImage}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                ref={imgRef}
                                src={images.find((image) => image.id === selectedImage)?.image}
                                alt="Crop selected image"
                                className="h-full w-full object-cover"
                            />
                        </DynamicCropComponent>
                    )}
                </div>

                <DialogFooter className="mt-auto flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setEnableCrop(false)
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() => {
                            setEnableCrop(false)
                            cropImageNow()
                        }}
                        className="flex-center gap-1.5"
                    >
                        <span>Done</span>
                        <CropIcon size={19} className="opacity-80" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ReplaceImage() {
    const { setImages, images } = useImageOptions()
    const { selectedImage } = useSelectedLayers()

    const { setImagesCheck, imagesCheck } = useColorExtractor()

    const onDrop = async (file: File | undefined) => {
        const analyze = (await import('rgbaster')).default
        if (file) {
            const imageUrl = URL.createObjectURL(file)

            const result = await analyze(imageUrl, {
                scale: 0.3,
            })
            const extractedColors = result.slice(0, 12)

            selectedImage &&
                setImages(
                    images.map((image) =>
                        image.id === selectedImage
                            ? {
                                ...image,
                                image: imageUrl,
                                extractedColors,
                            }
                            : image
                    )
                )

            setImagesCheck([...imagesCheck, imageUrl])
        }
    }
    return (
        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <label className="ml-6" htmlFor="file-replace">
                Replace image
            </label>
            <input
                id="file-replace"
                name="file-replace"
                type="file"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onDrop(e.target.files?.[0])
                }}
                accept="image/*"
                className="sr-only"
            />
            <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                <ImagePlus size={19} className="opacity-80" />
            </span>
        </div>
    )
}
