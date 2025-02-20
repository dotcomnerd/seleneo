'use client'

import { ExportActions } from '@/components/studio/export/handlers'
import { ExportQualityPopover, FileTypePopover } from '@/components/studio/export/popovers'
import { FileType } from '@/components/studio/export/types'
import { cn } from '@/lib/utils'
import { useSession } from '@/lib/auth-client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function ExportOptions() {
    const { data: session } = useSession()
    const [quality, setQuality] = useState<number>(1)
    const [fileType, setFileType] = useState<FileType>('PNG')
    const pathname = usePathname()

    return (
        <>
            <div className={cn("", pathname !== '/studio' ? 'hidden' : 'flex-center')}>
                <ExportActions quality={quality} fileType={fileType} sessionStatus={session} />
                <div className="h-4 w-px bg-border" />
                <div className='flex items-center space-x-0'>
                    <ExportQualityPopover quality={quality} setQuality={setQuality} />
                    <FileTypePopover fileType={fileType} setFileType={setFileType} />
                </div>
            </div>
        </>
    )
}
