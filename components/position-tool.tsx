import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter, MoveHorizontal, MoveVertical } from 'lucide-react'

export function PositionTool() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="text-xs font-bold mb-2 block">POSITION</Label>
        <div className="flex gap-2">
          <Input type="number" placeholder="X" className="w-20" />
          <Input type="number" placeholder="Y" className="w-20" />
        </div>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">SIZE</Label>
        <div className="flex gap-2">
          <Input type="number" placeholder="Width" className="w-20" />
          <Input type="number" placeholder="Height" className="w-20" />
        </div>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">ROTATION</Label>
        <Slider defaultValue={[0]} min={-180} max={180} step={1} />
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">ALIGN</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <AlignHorizontalJustifyCenter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <AlignVerticalJustifyCenter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">DISTRIBUTE</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <MoveHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MoveVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">OPACITY</Label>
        <Slider defaultValue={[100]} max={100} step={1} />
      </div>
    </div>
  )
}

