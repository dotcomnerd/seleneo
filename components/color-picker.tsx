"use client"

import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function ColorPicker() {
  const [color, setColor] = useState('#000000')

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-10 h-10 rounded-md border"
        style={{ backgroundColor: color }}
      />
      <div>
        <Label className="sr-only" htmlFor="color-input">Choose color</Label>
        <Input
          id="color-input"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10"
        />
      </div>
      <Input
        type="text"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-24"
      />
    </div>
  )
}

