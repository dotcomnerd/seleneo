'use client'

import { type FileType } from '@/components/studio/export/types'
import { createSnapshot } from '@/components/studio/export/utils'
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { useImageOptions } from '@/store/use-image-options'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import { saveAs } from 'file-saver'
import { Copy, Download } from 'lucide-react'

interface ExportActionsProps {
    quality: number
    fileType: FileType
}

export function ExportActions({ quality, fileType }: ExportActionsProps) {
    const { images } = useImageOptions()
    const { scaleFactor } = useResizeCanvas()

    const checkExportPermission = () => {
        if (images.length === 0) {
            toast.error('No image to export', { description: 'Please upload an image first', dismissible: true })
            return false
        }
        return true
    }

    const handleCopy = async () => {
        if (!checkExportPermission()) return

        const isFirefox = navigator.userAgent.includes('Firefox')
        if (isFirefox) {
            toast.error('Not supported', { description: "Firefox doesn't support copying images", dismissible: true })
            return
        }

        try {
            const result = await createSnapshot(fileType, quality, scaleFactor)
            if (!result) return

            const clipboardItem = new ClipboardItem({
                'image/png': result instanceof Blob ? Promise.resolve(result) :
                    Promise.resolve(new Blob([result], { type: 'image/png' })),
            })

            await navigator.clipboard.write([clipboardItem])
            toast.success('Copied to clipboard', { description: 'Your design has been copied to clipboard', dismissible: true })
        } catch (error: any) {
            toast.error('Copy failed', { description: error.message, dismissible: true })
        }
    }

    const handleDownload = async () => {
        if (!checkExportPermission()) return

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
            toast.success('Download complete', { description: `Saved as ${fileType} at ${quality}x quality`, dismissible: true })
        } catch (error: any) {
            toast.error('Download failed', { description: error.message, dismissible: true })
        }
    }

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="hover:bg-background"
            >
                <Copy className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="hover:bg-background"
            >
                <Download className="h-4 w-4" />
            </Button>
        </div>
    )
}