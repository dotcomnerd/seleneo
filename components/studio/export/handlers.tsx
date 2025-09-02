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
import { useImageOptions } from '@/store/use-image-options'
import { useLastSavedTime } from '@/store/use-last-save'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import { saveAs } from 'file-saver'
import { Cloud, Copy, Download, Eye, EyeOff, HardDrive, RotateCcw, Save } from 'lucide-react'
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
    const { images, texts, setImages, setTexts, scale, setScale } = useImageOptions()
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
        if (images.length === 0) {
            toast.error('No image to export', { description: 'Please upload an image first' })
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
            setHasLocalSave(true)
            toast.success('Current State Saved Locally')
        } catch (error: any) {
            toast.error('Local save failed', { description: error.message })
        } finally {
            setIsSavingLocally(false)
        }
    }

    // helper function to load google font that was used in main-image.tsx
    const loadGoogleFont = (fontFamily: string) => {
        if (typeof window === 'undefined') return
        const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`)
        if (existingLink) return
        const link = document.createElement('link')
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@200;300;400;500;600;700;800&display=swap`
        link.rel = 'stylesheet'
        document.head.appendChild(link)
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

            // restore images
            if (savedImages && savedImages.length > 0) {
                setImages([...savedImages])
            }

            // restore texts and load custom fonts
            if (savedTexts && savedTexts.length > 0) {
                setTexts([...savedTexts])

                // load any custom fonts that were saved
                savedTexts.forEach((text: any) => {
                    if (text.style?.fontFamily && text.style.fontFamily !== 'Inter') {
                        loadGoogleFont(text.style.fontFamily)
                    }
                })
            }

            // restore background settings
            if (backgroundSettings) {
                if (backgroundSettings.backgroundColor) {
                    setBackground(backgroundSettings.backgroundColor)
                }
                if (backgroundSettings.backgroundType === 'solid') {
                    document?.documentElement.style.setProperty('--solid-bg', backgroundSettings.backgroundColor)
                    document?.documentElement.style.setProperty('--gradient-bg', backgroundSettings.backgroundColor)
                    document?.documentElement.style.setProperty('--mesh-bg', backgroundSettings.backgroundColor)
                } else if (backgroundSettings.backgroundType === 'gradient') {
                    document?.documentElement.style.setProperty('--gradient-bg', backgroundSettings.backgroundColor)
                } else if (backgroundSettings.backgroundType === 'mesh') {
                    document?.documentElement.style.setProperty('--mesh-bg', backgroundSettings.backgroundColor)
                }
                if (backgroundSettings.imageBackground) {
                    setImageBackground(backgroundSettings.imageBackground)
                }
                if (backgroundSettings.noise !== undefined) {
                    setNoise(backgroundSettings.noise)
                }
                if (backgroundSettings.gradientAngle !== undefined) {
                    setGradientAngle(backgroundSettings.gradientAngle)
                }
                if (backgroundSettings.solidColor) {
                    setSolidColor(backgroundSettings.solidColor)
                }
                if (backgroundSettings.attribution) {
                    setAttribution(backgroundSettings.attribution)
                }
                if (backgroundSettings.highResBackground !== undefined) {
                    setHighResBackground(backgroundSettings.highResBackground)
                }
                if (backgroundSettings.isBackgroundClicked !== undefined) {
                    setIsBackgroundClicked(backgroundSettings.isBackgroundClicked)
                }
            }

            // restore canvas settings
            if (canvasSettings) {
                if (canvasSettings.scale !== undefined) {
                    setScale(canvasSettings.scale)
                }
                if (canvasSettings.resolution) {
                    setResolution(canvasSettings.resolution)
                }
                if (canvasSettings.canvasRoundness !== undefined) {
                    setCanvasRoundness(canvasSettings.canvasRoundness)
                }
                if (canvasSettings.scrollScale !== undefined) {
                    setScrollScale(canvasSettings.scrollScale)
                }
                if (canvasSettings.automaticResolution !== undefined) {
                    setAutomaticResolution(canvasSettings.automaticResolution)
                }
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
                                            className="hover:bg-background"
                                        >
                                            <Save className="h-4 w-4" />
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