"use client"

import { useCanvas } from "@/hooks/useCanvas"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function Canvas() {
  const { canvasRef, canvasState, updateCanvasSize, toggleSnapToGrid } = useCanvas()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-4 border-b">
        <div className="flex items-center gap-2">
          <Label htmlFor="auto-resolution" className="text-sm">Auto resolution</Label>
          <Switch id="auto-resolution" checked={canvasState.snapToGrid} onCheckedChange={toggleSnapToGrid} />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Width"
            className="w-24 h-8"
            value={canvasState.width}
            onChange={(e) => updateCanvasSize(Number(e.target.value), canvasState.height)}
          />
          <span>x</span>
          <Input
            type="number"
            placeholder="Height"
            className="w-24 h-8"
            value={canvasState.height}
            onChange={(e) => updateCanvasSize(canvasState.width, Number(e.target.value))}
          />
        </div>
      </div>
      <Card className="flex-1 m-4 flex items-center justify-center">
        <canvas ref={canvasRef} width={canvasState.width} height={canvasState.height} className="border" />
      </Card>
    </div>
  )
}