import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CuboidIcon as Cube, SpaceIcon as Sphere, Cylinder } from 'lucide-react'

export function ThreeDTool() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="text-xs font-bold mb-2 block">3D SHAPE</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Cube className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Sphere className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Cylinder className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">MATERIAL</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="matte">Matte</SelectItem>
            <SelectItem value="glossy">Glossy</SelectItem>
            <SelectItem value="metallic">Metallic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">ROTATION</Label>
        <div className="flex gap-2">
          <Input type="number" placeholder="X" className="w-20" />
          <Input type="number" placeholder="Y" className="w-20" />
          <Input type="number" placeholder="Z" className="w-20" />
        </div>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">SCALE</Label>
        <Slider defaultValue={[1]} min={0.1} max={2} step={0.1} />
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">LIGHTING</Label>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>
      <Button variant="secondary" className="w-full">Add 3D Object</Button>
    </div>
  )
}

