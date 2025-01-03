import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RotateCcw, RotateCw } from 'lucide-react'
import ColorPicker  from "@/components/color-picker"

export function BackgroundTool() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="text-xs font-bold mb-2 block">BACKGROUND</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="w-full">Gradient</Button>
          <Button variant="outline" size="sm" className="w-full">Wallpaper</Button>
          <Button variant="outline" size="sm" className="w-full">Pick</Button>
        </div>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">NOISE</Label>
        <Slider defaultValue={[33]} max={100} step={1} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold">ADAPTIVE</Label>
        <div className="flex items-center space-x-2">
          <Label htmlFor="adaptive-mode" className="text-xs">Beta</Label>
          <Switch id="adaptive-mode" />
        </div>
      </div>
      <Button variant="secondary" size="sm" className="w-full">
        Generate
      </Button>
      <div>
        <Label className="text-xs font-bold mb-2 block">GRADIENTS:</Label>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="aspect-square rounded-md bg-gradient-to-br from-purple-500 to-pink-500" />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold">Gradient angle</Label>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Input type="number" className="w-16 h-8" defaultValue="170" />
          <Button variant="outline" size="icon" className="h-8 w-8">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">COLOR PICKER</Label>
        <ColorPicker />
      </div>
    </div>
  )
}
