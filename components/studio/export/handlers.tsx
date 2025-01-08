'use client'

import Spinner from '@/components/spinner/spinner'
import { type FileType } from '@/components/studio/export/types'
import { createSnapshot } from '@/components/studio/export/utils'
import { Button } from "@/components/ui/button"
import { useImageOptions } from '@/store/use-image-options'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import { saveAs } from 'file-saver'
import { Copy, Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ExportActionsProps {
    quality: number
    fileType: FileType
}

export function ExportActions({ quality, fileType }: ExportActionsProps) {
    const { images } = useImageOptions()
    const { scaleFactor } = useResizeCanvas()
    const [isCopying, setIsCopying] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const checkExportPermission = () => {
        if (images.length === 0) {
            toast.error('No image to export', { description: 'Please upload an image first' })
            return false
        }
        return true
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

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                disabled={isCopying || isDownloading}
                className="hover:bg-background"
            >
                {isCopying ? <Spinner /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                disabled={isCopying || isDownloading}
                className="hover:bg-background"
            >
                {isDownloading ? <Spinner /> : <Download className="h-4 w-4" />}
            </Button>
        </div>
    )
}