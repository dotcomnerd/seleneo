import { useCanvas } from "@/hooks/useCanvas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export function CanvasTool() {
  const { canvasState, updateCanvasSize, updateGridSize, toggleSnapToGrid } = useCanvas()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="text-xs font-bold mb-2 block">CANVAS SIZE</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Width"
            className="w-20"
            value={canvasState.width}
            onChange={(e) => updateCanvasSize(Number(e.target.value), canvasState.height)}
          />
          <span className="flex items-center">x</span>
          <Input
            type="number"
            placeholder="Height"
            className="w-20"
            value={canvasState.height}
            onChange={(e) => updateCanvasSize(canvasState.width, Number(e.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold">SNAP TO GRID</Label>
        <Switch checked={canvasState.snapToGrid} onCheckedChange={toggleSnapToGrid} />
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">GRID SIZE</Label>
        <Slider
          defaultValue={[canvasState.gridSize]}
          max={50}
          step={1}
          onValueChange={(value) => updateGridSize(value[0])}
        />
      </div>
      <Button variant="secondary" className="w-full" onClick={() => updateCanvasSize(1920, 1080)}>Reset Canvas</Button>
    </div>
  )
}