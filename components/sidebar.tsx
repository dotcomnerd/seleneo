"use client"

import BackgroundOptions from '@/components/studio/background/index'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useActiveIndexStore } from '@/store/use-active-index'
import {
    AppWindow,
    Box,
    Image as Images,
    Locate,
    Paintbrush,
    Palette,
    PanelTop,
    TextCursor,
} from 'lucide-react'
import React, { useMemo } from 'react'
import CanvasOptions from './studio/canvas/index'
import DrawingOptions from './studio/drawing/index'
import FrameOptions from './studio/frame/index'
import ImageOptions from './studio/image/index'
import PerspectiveOptions from './studio/perspective/index'
import PositionOptions from './studio/position/index'
import SidebarButton from './studio/sidebar-buttons'
import TextOptions from './studio/text/index'
import { UndoRedoButtons, useUndoRedoHotkeys } from './undo-redo-buttons'

type SidebarSection =
    | 'canvas'
    | 'image'
    | 'background'
    | 'frame'
    | 'text'
    | 'draw'
    | '3d'
    | 'position'

interface SidebarButton {
    id: SidebarSection
    text: string
    icon: React.ElementType
    component: React.ComponentType
}


function useSidebarButtons() {
    return useMemo<SidebarButton[]>(
        () => [
            {
                id: 'canvas',
                text: 'Canvas',
                icon: AppWindow,
                component: CanvasOptions,
            },
            { id: 'image', text: 'Image', icon: Images, component: ImageOptions },
            {
                id: 'background',
                text: 'Background',
                icon: Palette,
                component: BackgroundOptions,
            },
            { id: 'frame', text: 'Frame', icon: PanelTop, component: FrameOptions },
            { id: 'draw', text: 'Draw', icon: Paintbrush, component: DrawingOptions },
            { id: 'text', text: 'Text', icon: TextCursor, component: TextOptions },
            { id: '3d', text: '3D', icon: Box, component: PerspectiveOptions },
            {
                id: 'position',
                text: 'Position',
                icon: Locate,
                component: PositionOptions,
            },
        ],
        []
    )
}

interface SidebarImageSettingsProps {
    sidebarButtons: SidebarButton[]
}

export function SidebarImageSettings({
    sidebarButtons,
}: SidebarImageSettingsProps) {
    const { activeIndex } = useActiveIndexStore()
    const activeButton = sidebarButtons[activeIndex] ?? sidebarButtons[1]
    const ActiveComponent = activeButton?.component

    return (
        <ScrollArea type="scroll">
            <div className="flex flex-col px-[1.6rem]">
                <div className="flex w-full flex-col py-10">
                    <h3 className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase text-dark/70">
                        {React.createElement(activeButton.icon, { size: 20 })}
                        <div>{activeButton.text}</div>
                        <UndoRedoButtons />
                    </h3>
                    {ActiveComponent && <ActiveComponent />}
                </div>
            </div>
        </ScrollArea>
    )
}

export function Sidebar() {
    const sidebarButtons = useSidebarButtons()
    const { activeIndex } = useActiveIndexStore()
    const activeSection = sidebarButtons[activeIndex]?.id ?? 'image'
    useUndoRedoHotkeys()

    return (
        <aside className="flex w-[6rem] overflow-x-hidden border-r border-border/60 md:min-w-[25rem] md:max-w-[25rem]">
            <ul className="no-scrollbar relative flex basis-[100%] flex-col items-center gap-6 overflow-x-hidden border px-4 py-4 md:max-w-[28%] md:basis-[28%] md:border-r">
                {sidebarButtons.map((button, index) => (
                    <SidebarButton
                        key={button.id}
                        text={button.text}
                        icon={
                            <button.icon
                                size={20}
                                strokeWidth={button.id === activeSection ? 2.25 : 2}
                            />
                        }
                        index={index}
                    />
                ))}
            </ul>
            <div className="relative hidden h-full w-full flex-col overflow-hidden md:flex">
                <SidebarImageSettings sidebarButtons={sidebarButtons} />
            </div>
        </aside>
    )
}
