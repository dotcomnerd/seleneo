'use client'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useDrawingTools } from '@/store/use-drawing'
import { useImageOptions } from '@/store/use-image-options'
import { Trash } from 'lucide-react'
import React from 'react'

export default function DrawingContextMenu({ id, children }: { id: string; children: React.ReactNode }) {
    const { drawings = [], setDrawings } = useImageOptions()
    const { setSelectedStrokeId } = useDrawingTools()

    const handleDelete = () => {
        const filtered = drawings.filter((d) => d.id !== id)
        setDrawings?.(filtered)
        setSelectedStrokeId(null)
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild onContextMenu={() => setSelectedStrokeId(id)}>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
                <ContextMenuItem inset onClick={handleDelete} className="text-[#F46567]/70 focus:text-[#f46567]/80">
                    Delete stroke
                    <ContextMenuShortcut>
                        <Trash size={18} className="text-[#F46567]/70 opacity-80" />
                    </ContextMenuShortcut>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
