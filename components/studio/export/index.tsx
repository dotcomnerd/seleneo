'use client'

import { ExportActions } from '@/components/studio/export/handlers'
import { ExportQualityPopover, FileTypePopover } from '@/components/studio/export/popovers'
import { FileType } from '@/components/studio/export/types'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export function ExportOptions() {
    const [quality, setQuality] = useState<number>(1)
    const [fileType, setFileType] = useState<FileType>('PNG')
    const session = useSession()

    return (
        <>
            <ExportActions quality={quality} fileType={fileType} sessionStatus={session.status} />
            <div className="h-4 w-px bg-border" />
            <ExportQualityPopover quality={quality} setQuality={setQuality} />
            <FileTypePopover fileType={fileType} setFileType={setFileType} />
        </>
    )
}