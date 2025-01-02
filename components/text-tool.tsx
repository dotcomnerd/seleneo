import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react'

export function TextTool() {
  return (
    <div className="flex flex-col gap-4">
      <Input type="text" placeholder="Enter text here" />
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">FONT</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arial">Arial</SelectItem>
            <SelectItem value="helvetica">Helvetica</SelectItem>
            <SelectItem value="times">Times New Roman</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">FONT SIZE</Label>
        <Slider defaultValue={[16]} max={72} step={1} />
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">LINE HEIGHT</Label>
        <Slider defaultValue={[1.5]} max={3} step={0.1} />
      </div>
      <div>
        <Label className="text-xs font-bold mb-2 block">LETTER SPACING</Label>
        <Slider defaultValue={[0]} min={-5} max={10} step={0.1} />
      </div>
    </div>
  )
}

