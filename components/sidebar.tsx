"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Monitor, ImageIcon, Palette, Square, Type, CuboidIcon as Cube, Move } from 'lucide-react'
import { CanvasTool } from "./canvas-tool"
import { ImageTool } from "./image-tool"
import { BackgroundTool } from "./background-tool"
import { FrameTool } from "./frame-tool"
import { TextTool } from "./text-tool"
import { ThreeDTool } from "./three-d-tool"
import { PositionTool } from "./position-tool"
import { BottomNav } from "./bottom-nav"

const tools = [
  { icon: Monitor, label: "Canvas", component: CanvasTool },
  { icon: ImageIcon, label: "Image", component: ImageTool },
  { icon: Palette, label: "Background", component: BackgroundTool },
  { icon: Square, label: "Frame", component: FrameTool },
  { icon: Type, label: "Text", component: TextTool },
  { icon: Cube, label: "3D", component: ThreeDTool },
  { icon: Move, label: "Position", component: PositionTool },
]

export function Sidebar() {
  const [selectedTool, setSelectedTool] = useState(tools[0])

  return (
    <div className="flex h-full border-r">
      <div className="flex w-20 flex-col justify-between border-r">
        <div>
          {tools.map((Tool, index) => (
            <Button
              key={index}
              variant={selectedTool === Tool ? "secondary" : "ghost"}
              size="icon"
              className="h-20 w-20 rounded-none flex flex-col items-center justify-center"
              onClick={() => setSelectedTool(Tool)}
            >
              <Tool.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{Tool.label}</span>
            </Button>
          ))}
        </div>
      </div>
      <div className="w-60 flex flex-col">
        <div className="p-4 flex-1 overflow-y-auto">
          {selectedTool.component && <selectedTool.component />}
        </div>
        <BottomNav />
      </div>
    </div>
  )
}
