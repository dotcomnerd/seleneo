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
        x: 10,
        y: 10,
        width: 80,
        height: 80,
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
        (async () => {
            if (images.length === 0) {
                toast.error('Cannot Save Empty Canvas', { position: 'top-left' })
                return
            }

            const toDataUrl = async (url: string): Promise<string> => {
                const res = await fetch(url)
                const blob = await res.blob()
                return await new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result as string)
                    reader.onerror = reject
                    reader.readAsDataURL(blob)
                })
            }

            const imagesForSave = await Promise.all(
                images.map(async (img) => {
                    if (typeof img.image === 'string') {
                        return { ...img, image: await toDataUrl(img.image) }
                    }
                    return img
                })
            )

            const canvasState = {
                images: imagesForSave,
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
        })()
    })

    const cropImageNow = async () => {
        if (typeof window === 'undefined') return;

        const image = imgRef.current
        if (!image) {
            toast.error('No image found to crop')
            return
        }

        let cropWidth, cropHeight
        if (crop.unit === '%') {
            cropWidth = (crop.width / 100) * image.width
            cropHeight = (crop.height / 100) * image.height
        } else {
            cropWidth = crop.width
            cropHeight = crop.height
        }

        if (!image.naturalWidth || !image.naturalHeight) {
            toast.error('Image not fully loaded, please try again')
            return
        }

        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                toast.error('Failed to create canvas context')
                return
            }

            const currentImageSrc = images.find((img) => img.id === selectedImage)?.image || ''
            let imageToCrop: HTMLImageElement
            if (currentImageSrc.startsWith('data:') || currentImageSrc.startsWith('blob:')) {
                imageToCrop = image
            } else {
                // for external URLs we need a new image element to avoid CORS issues
                // (https://issues.chromium.org/issues/40381978)
                imageToCrop = new Image()
                imageToCrop.crossOrigin = 'anonymous'
                await new Promise((resolve, reject) => {
                    imageToCrop.onload = resolve
                    imageToCrop.onerror = reject
                    imageToCrop.src = currentImageSrc
                })
            }

            // convert percentage crop to pixel coordinates
            let cropX, cropY, cropWidth, cropHeight

            if (crop.unit === '%') {
                cropX = (crop.x / 100) * image.width
                cropY = (crop.y / 100) * image.height
                cropWidth = (crop.width / 100) * image.width
                cropHeight = (crop.height / 100) * image.height
            } else {
                // cuz its already in pixels
                cropX = crop.x
                cropY = crop.y
                cropWidth = crop.width
                cropHeight = crop.height
            }

            const scaleX = imageToCrop.naturalWidth / image.width
            const scaleY = imageToCrop.naturalHeight / image.height
            const pixelRatio = window.devicePixelRatio || 1
            canvas.width = cropWidth * pixelRatio * scaleX
            canvas.height = cropHeight * pixelRatio * scaleY
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(
                imageToCrop,
                cropX * scaleX,
                cropY * scaleY,
                cropWidth * scaleX,
                cropHeight * scaleY,
                0,
                0,
                cropWidth * scaleX,
                cropHeight * scaleY
            )

            const base64Image = canvas.toDataURL('image/png', 1.0)
            if (selectedImage) {
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
        } catch (error) {
            if (error instanceof Error && error.message.includes('CORS')) {
                toast.error('Cannot crop this image due to security restrictions. Try uploading the image again.')
            } else {
                toast.error('Failed to crop image, please try again later.')
            }
        }
    }

    return (
        <Dialog
            open={enableCrop}
            onOpenChange={(open) => {
                if (open === false) {
                    setEnableCrop(false)
                } else {
                    setEnableCrop(open)
                    setCrop({
                        unit: '%',
                        x: 10,
                        y: 10,
                        width: 80,
                        height: 80,
                    })
                }
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
                            onChange={(crop, percentCrop) => setCrop(percentCrop)}
                            onComplete={(crop, percentCrop) => setCrop(percentCrop)}
                            disabled={!enableCrop || !selectedImage}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                ref={imgRef}
                                src={(function () {
                                    const src = images.find((image) => image.id === selectedImage)?.image || ''
                                    if (!src || src.startsWith('blob:') || src.startsWith('data:')) return src
                                    const sep = src.includes('?') ? '&' : '?'
                                    return `${src}${sep}seleneo-cache-bust=${Date.now()}`
                                })()}
                                alt="Crop selected image"
                                className="h-full w-full object-cover"
                                crossOrigin="anonymous"
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
                        onClick={async () => {
                            setEnableCrop(false)
                            await cropImageNow()
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
