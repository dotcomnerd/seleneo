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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useImageOptions } from '@/store/use-image-options'
import { useLastSavedTime } from '@/store/use-last-save'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import { saveAs } from 'file-saver'
import { Copy, Download, Eye, EyeOff, Save } from 'lucide-react'
import { useState } from 'react'
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
    const { images } = useImageOptions()
    const { scaleFactor } = useResizeCanvas()
    const [isCopying, setIsCopying] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const { lastSavedTime, setLastSavedTime } = useLastSavedTime()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [existingImage, setExistingImage] = useState<DuplicateResponse | null>(null)
    const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PRIVATE");

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

    return (
        <>
            <div className="flex items-center">
                <div className="flex items-center -space-x-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopy}
                        disabled={isCopying || isDownloading || isSaving}
                        className="hover:bg-background"
                    >
                        {isCopying ? <Spinner /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                        disabled={isCopying || isDownloading || isSaving}
                        className="hover:bg-background"
                    >
                        {isDownloading ? <Spinner /> : <Download className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCloudSave}
                        disabled={isCopying || isDownloading || isSaving || sessionStatus !== 'authenticated'}
                        title={sessionStatus === 'unauthenticated' ? 'Login to save your design!' : 'Save your design to the cloud'}
                        className="hover:bg-background"
                    >
                        {isSaving ? <Spinner /> : <Save className="h-4 w-4" />}
                    </Button>
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