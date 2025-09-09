'use client'

import Spinner from '@/components/spinner/spinner'
import { type FileType } from '@/components/studio/export/types'
import { createSnapshot } from '@/components/studio/export/utils'
import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useBackgroundOptions } from '@/store/use-background-options'
import { useImageOptions, useSelectedLayers } from '@/store/use-image-options'
import { useLastSavedTime } from '@/store/use-last-save'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import { saveAs } from 'file-saver'
import { ChevronDown, ChevronUp, Cloud, Copy, Download, Eye, EyeOff, HardDrive, RotateCcw, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ExportActionsProps {
    quality: number
    fileType: FileType
    sessionStatus: "authenticated" | "loading" | "unauthenticated"
}

type SuccessResponse = DuplicateResponse | NewSaveResponse;

export interface DuplicateResponse {
    type: "DUPLICATE";
    cloudflareUrl: string;
    id: string;
    identifier: string;
    isOwner: boolean;
    status: number;
    message: string;
}

export interface NewSaveResponse {
    type: "NEW_SAVE";
    message: string;
    status: number;
    visibility: "PUBLIC" | "PRIVATE";
}

export function ExportActions({ quality, fileType, sessionStatus }: ExportActionsProps) {
    const { images, texts, drawings, scale, setImages, setTexts, setScale, setInitialImageUploaded } = useImageOptions()
    const { setSelectedImage } = useSelectedLayers()
    const {
        background,
        backgroundType,
        imageBackground,
        noise,
        gradientAngle,
        solidColor,
        attribution,
        highResBackground,
        isBackgroundClicked,
        setBackground,
        setBackgroundType,
        setImageBackground,
        setNoise,
        setGradientAngle,
        setSolidColor,
        setAttribution,
        setHighResBackground,
        setIsBackgroundClicked
    } = useBackgroundOptions()
    const {
        scaleFactor,
        resolution,
        canvasRoundness,
        scrollScale,
        automaticResolution,
        setResolution,
        setCanvasRoundness,
        setScrollScale,
        setAutomaticResolution
    } = useResizeCanvas()
    const [isCopying, setIsCopying] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isSavingLocally, setIsSavingLocally] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)
    const { lastSavedTime, setLastSavedTime } = useLastSavedTime()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [savePopoverOpen, setSavePopoverOpen] = useState(false)
    const [existingImage, setExistingImage] = useState<DuplicateResponse | null>(null)
    const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PRIVATE")
    const [hasLocalSave, setHasLocalSave] = useState(false)

    // check if local save exists on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const canvasState = localStorage.getItem('canvasState')
            setHasLocalSave(canvasState !== null)
        }
    }, [])

    const checkExportPermission = () => {
        const hasImages = images.length > 0
        const hasTexts = texts.length > 0 && texts.some(text => text.content.trim() !== '')
        const hasDrawings = drawings && drawings.length > 0

        if (!hasImages && !hasTexts && !hasDrawings) {
            toast.error('No content to export', { description: 'Please add an image, text, or drawing first' })
            return false
        }
        return true
    }

    const toggleVisibility = () => {
        setVisibility((prev) => prev === "PUBLIC" ? "PRIVATE" : "PUBLIC")
    }

    const handleCopy = async () => {
        if (!checkExportPermission() || isCopying) return

        setIsCopying(true)
        try {
            const result = await createSnapshot(fileType, quality, scaleFactor)
            if (!result) return

            const isFirefox = navigator.userAgent.includes('Firefox')
            if (isFirefox) {
                toast.error('Not supported', { description: "Firefox doesn't support copying images" })
                return
            }

            const clipboardItem = new ClipboardItem({
                'image/png': result instanceof Blob ? result : new Blob([result], { type: 'image/png' }),
            })
            await navigator.clipboard.write([clipboardItem])
            toast.success('Copied to clipboard')
        } catch (error: any) {
            toast.error(`Copy failed: ${error.message}`)
        } finally {
            setIsCopying(false)
        }
    }

    const handleDownload = async () => {
        if (!checkExportPermission() || isDownloading) return

        setIsDownloading(true)
        try {
            const result = await createSnapshot(fileType, quality, scaleFactor)
            if (!result) return

            if (fileType === 'WEBP') {
                const a = document.createElement('a')
                a.href = result as string
                a.download = `export-${Date.now()}.webp`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
            } else {
                saveAs(result, `export-${Date.now()}.${fileType.toLowerCase()}`)
            }
            toast.success('Download complete', { description: `Saved as ${fileType} at ${quality}x quality` })
        } catch (error: any) {
            toast.error(`Download failed: ${error.message}`)
        } finally {
            setIsDownloading(false)
        }
    }

    const handleCloudSave = async () => {
        if (!checkExportPermission() || isSaving) return;

        setIsSaving(true);

        try {
            const snapshot = await createSnapshot(fileType, quality, scaleFactor);
            if (!snapshot) return;

            const formData: FormData = new FormData();

            //i dont like this but im on a time crunch
            const snapshotBlob: Blob = typeof snapshot === 'string' ? new Blob([snapshot], { type: 'image/webp' }) : snapshot;

            // TODO: Make this global state so that if the image is uploaded successfully, it is added 2 the list of identifiers
            const identifier = crypto.randomUUID();

            formData.append('file', snapshotBlob, `export-${Date.now()}.${fileType.toLowerCase()}`);
            formData.append('identifier', identifier);
            formData.append('visibility', visibility);

            const response = await fetch("/api/save", {
                method: "POST",
                body: formData,
            });

            if (response.status === 401) {
                throw new Error('Login to save design');
            }

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data: SuccessResponse = await response.json();

            if (data.type === 'DUPLICATE') {
                setExistingImage(data);
                setDialogOpen(true);
                return;
            } else if (data.type === 'NEW_SAVE') {
                setExistingImage(null);
                setLastSavedTime(new Date());
                setVisibility(data.visibility);
            }

            toast.success(`Saved`, { description: `Your design has been saved as ${data.visibility === 'PUBLIC' ? 'public.' : 'private.'}` });
        } catch (error: any) {
            toast.error('Save failed', { description: error.message });
        } finally {
            setIsSaving(false);
        }
    }

    const handleLocalSave = async () => {
        if (!checkExportPermission() || isSavingLocally) return

        setIsSavingLocally(true)
        try {
            if (images.length === 0) {
                toast.error('Cannot Save Empty Canvas')
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
                    if (typeof img.image === 'string' && img.image.startsWith('blob:')) {
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
            setHasLocalSave(true)
            toast.success('Current State Saved Locally')
        } catch (error: any) {
            toast.error('Local save failed', { description: error.message })
        } finally {
            setIsSavingLocally(false)
        }
    }

    const loadGoogleFont = (fontFamily: string) => {
        if (typeof window === 'undefined') return
        const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`)
        if (existingLink) return
        const link = document.createElement('link')
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@200;300;400;500;600;700;800&display=swap`
        link.rel = 'stylesheet'
        document.head.appendChild(link)
    }

    const restoreIfDefined = (
        value: any,
        setter: (value: any) => void
    ) => {
        if (value !== undefined && value !== null) {
            setter(value)
        }
    }

    const restoreBackgroundType = (backgroundType: string, backgroundColor: string) => {
        switch (backgroundType) {
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

    const handleRestoreLocalSave = async () => {
        if (isRestoring) return

        setIsRestoring(true)
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
                setInitialImageUploaded(true) // hide upload image CTA
                setSelectedImage(savedImages[0]?.id ?? null)
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

                if (backgroundSettings.backgroundColor && backgroundSettings.backgroundType) {
                    restoreBackgroundType(backgroundSettings.backgroundType, backgroundSettings.backgroundColor)
                }
            }

            if (canvasSettings) {
                restoreIfDefined(canvasSettings.scale, setScale)
                restoreIfDefined(canvasSettings.resolution, setResolution)
                restoreIfDefined(canvasSettings.canvasRoundness, setCanvasRoundness)
                restoreIfDefined(canvasSettings.scrollScale, setScrollScale)
                restoreIfDefined(canvasSettings.automaticResolution, setAutomaticResolution)
            }

            toast.success("Local State Restored Successfully")
        } catch (error: any) {
            toast.error("Error Loading Saved State", { description: error.message })
        } finally {
            setIsRestoring(false)
        }
    }

    return (
        <>
            <div className="flex items-center">
                <div className="flex items-center -space-x-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopy}
                        disabled={isCopying || isDownloading || isSaving || isSavingLocally || isRestoring}
                        className="hover:bg-background"
                    >
                        {isCopying ? <Spinner /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                        disabled={isCopying || isDownloading || isSaving || isSavingLocally || isRestoring}
                        className="hover:bg-background"
                    >
                        {isDownloading ? <Spinner /> : <Download className="h-4 w-4" />}
                    </Button>
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <Popover open={savePopoverOpen} onOpenChange={setSavePopoverOpen}>
                                <PopoverTrigger asChild>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={isCopying || isDownloading || isSaving || isSavingLocally || isRestoring}
                                            className="hover:bg-background flex items-center gap-1 px-2"
                                        >
                                            <Save className="h-4 w-4" />
                                            {savePopoverOpen ? (
                                                <ChevronUp className="h-3 w-3" />
                                            ) : (
                                                <ChevronDown className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                </PopoverTrigger>
                                <PopoverContent className="w-fit p-3" align="end">
                                    <div
                                        className="flex items-center gap-2"
                                        onFocusCapture={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <TooltipProvider>
                                            <Tooltip delayDuration={100}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => {
                                                            handleCloudSave()
                                                            setSavePopoverOpen(false)
                                                        }}
                                                        disabled={isSaving || sessionStatus !== 'authenticated'}
                                                        className="h-9 w-9"
                                                    >
                                                        {isSaving ? <Spinner /> : <Cloud className="h-4 w-4" />}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{sessionStatus === 'unauthenticated' ? 'Login to save your design to the cloud' : 'Save to Cloud'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={100}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => {
                                                            handleLocalSave()
                                                            setSavePopoverOpen(false)
                                                        }}
                                                        disabled={isSavingLocally}
                                                        className="h-9 w-9"
                                                    >
                                                        {isSavingLocally ? <Spinner /> : <HardDrive className="h-4 w-4" />}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Save Locally</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={100}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => {
                                                            handleRestoreLocalSave()
                                                            setSavePopoverOpen(false)
                                                        }}
                                                        disabled={!hasLocalSave || isRestoring}
                                                        className="h-9 w-9"
                                                    >
                                                        {isRestoring ? <Spinner /> : <RotateCcw className="h-4 w-4" />}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{hasLocalSave ? 'Restore Local Save' : 'No local save found'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <TooltipContent>
                                <p>Save Options</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1 px-4">
                    <p className="text-sm dark:text-white">
                        {lastSavedTime
                            ? `Last saved at: ${lastSavedTime.toLocaleTimeString()}`
                            : "Not saved yet"}
                    </p>
                </div>
                <div className="h-4 w-px bg-border" />
                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-4 ml-auto px-2">
                                <span title={`Visibility: ${visibility}`}>
                                    {visibility === "PUBLIC" ? (
                                        <Eye className="size-4 dark:stroke-white/50" />
                                    ) : (
                                        <EyeOff className="size-4 dark:stroke-white/50" />
                                    )}
                                </span>
                                <Checkbox
                                    checked={visibility === "PUBLIC"}
                                    onCheckedChange={toggleVisibility}
                                    disabled={isSaving}
                                    aria-label="Toggle visibility"
                                    className="data-[state=on]:bg-primary"
                                    title="Toggle visibility"
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Current Visibility: {visibility === "PUBLIC" ? "Public" : "Private"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <DialogTitle>Duplicate Image Found</DialogTitle>
                            </div>
                        </DialogHeader>
                        {existingImage && (
                            <>
                                <DialogDescription>
                                    This image {existingImage.isOwner ? 'was previously created by you' : 'already exists in our system'}
                                </DialogDescription>
                                <div className="mt-4">
                                    <img
                                        src={existingImage.cloudflareUrl}
                                        alt="Existing similar image"
                                        className="w-full rounded-lg object-cover"
                                    />
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}