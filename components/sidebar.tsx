"use client"

import BackgroundOptions from '@/components/studio/background-options/index'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useActiveIndexStore } from '@/store/use-active-index'
import {
  AppWindow,
  Box,
  Image as Images,
  Locate,
  Palette,
  PanelTop,
  TextCursor,
} from 'lucide-react'
import React, { useMemo } from 'react'
import CanvasOptions from './studio/canvas-options/index'
import FrameOptions from './studio/frame-options/index'
import ImageOptions from './studio/image-options/index'
import PerspectiveOptions from './studio/perspective-options/index'
import PositionOptions from './studio/position-options/index'
import SidebarButton from './studio/sidebar-buttons'
import TextOptions from './studio/text-options/index'
import { UndoRedoButtons, useUndoRedoHotkeys } from './undo-redo-buttons'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Monitor, ImageIcon, Square, Type, CuboidIcon as Cube, Move } from 'lucide-react'
import { CanvasTool } from "./canvas-tool"
import { ImageTool } from "./image-tool"
import { BackgroundTool } from "./background-tool"
import { FrameTool } from "./frame-tool"
import { TextTool } from "./text-tool"
import { ThreeDTool } from "./three-d-tool"
import { PositionTool } from "./position-tool"
import { BottomNav } from "./bottom-nav"

type SidebarSection =
    | 'canvas'
    | 'image'
    | 'background'
    | 'frame'
    | 'text'
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

const tools = [
  { icon: Monitor, label: "Canvas", component: CanvasTool },
  { icon: ImageIcon, label: "Image", component: ImageTool },
  { icon: Palette, label: "Background", component: BackgroundTool },
  { icon: Square, label: "Frame", component: FrameTool },
  { icon: Type, label: "Text", component: TextTool },
  { icon: Cube, label: "3D", component: ThreeDTool },
  { icon: Move, label: "Position", component: PositionTool },
]

interface SidebarImageSettingsProps {
  sidebarButtons: SidebarButton[]
}

export function SidebarImageSettings({
  sidebarButtons,
}: SidebarImageSettingsProps) {
  const { activeIndex } = useActiveIndexStore()
  const activeButton = sidebarButtons[activeIndex] ?? sidebarButtons[1] // Default to image if no active index
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
//   const [selectedTool, setSelectedTool] = useState(tools[0])
  const sidebarButtons = useSidebarButtons()
  const { activeIndex } = useActiveIndexStore()
  const activeSection = sidebarButtons[activeIndex]?.id ?? 'image'
  useUndoRedoHotkeys()

//   return (
//     <div className="flex h-full border-r">
//       <div className="flex w-20 flex-col justify-between border-r">
//         <div>
//           {tools.map((Tool, index) => (
//             <Button
//               key={index}
//               variant={selectedTool === Tool ? "secondary" : "ghost"}
//               size="default"
//               className="h-20 w-20 rounded-none flex flex-col items-center justify-center"
//               onClick={() => setSelectedTool(Tool)}
//             >
//               <Tool.icon className="h-5 w-5 mb-1" />
//               <span className="text-xs">{Tool.label}</span>
//             </Button>
//           ))}
//         </div>
//       </div>
//       <div className="w-60 flex flex-col">
//         <div className="p-4 flex-1 overflow-y-auto">
//           {selectedTool.component && <selectedTool.component />}
//         </div>
//         <BottomNav />
//       </div>
//     </div>
//   )

    return (
        <aside className="flex w-[6rem] overflow-x-hidden border-r border-border/60 md:min-w-[25rem] md:max-w-[25rem]">
            <ul className="no-scrollbar relative flex basis-[100%] flex-col items-center gap-6 overflow-x-hidden border-[#22262b]/60 bg-[#131313] px-4 py-8 md:max-w-[28%] md:basis-[28%] md:border-r">
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
            <div className="relative hidden h-full w-full flex-col overflow-hidden bg-[#151515] md:flex">
                <SidebarImageSettings sidebarButtons={sidebarButtons} />
            </div>
        </aside>
    )
}
