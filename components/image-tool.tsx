import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ImageIcon, Crop, Maximize2, MinusCircle, PlusCircle } from 'lucide-react'

export function ImageTool() {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" className="w-full">
        <ImageIcon className="mr-2 h-4 w-4" />
        Upload Image
      </Button>
      <div>
        <Label className="text-xs font-bold mb-2 block">BRIGHTNESS</Label>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">CONTRAST</Label>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">SATURATION</Label>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <Crop className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <PlusCircle className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <MinusCircle className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">OPACITY</Label>
        <Slider defaultValue={[100]} max={100} step={1} />
      </div>
    </div>
  )
}

