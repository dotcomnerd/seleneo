import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Laptop, Smartphone, Tablet } from 'lucide-react'

export function FrameTool() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="text-xs font-bold mb-2 block">FRAME SIZE</Label>
        <div className="flex gap-2">
          <Input type="number" placeholder="Width" className="w-20" />
          <span className="flex items-center">x</span>
          <Input type="number" placeholder="Height" className="w-20" />
        </div>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">PRESET SIZES</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Tablet className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Laptop className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">CORNER RADIUS</Label>
        <Slider defaultValue={[0]} max={50} step={1} />
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">BORDER WIDTH</Label>
        <Slider defaultValue={[0]} max={20} step={1} />
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">PADDING</Label>
        <Slider defaultValue={[0]} max={100} step={1} />
      </div>
      <Button variant="secondary" className="w-full">Add Frame</Button>
    </div>
  )
}

