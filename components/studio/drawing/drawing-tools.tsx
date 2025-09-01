'use client'

import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { useDrawingTools } from '@/store/use-drawing'
import { Eraser, MousePointer, Palette, Pen } from 'lucide-react'
import { HexColorInput, HexColorPicker } from 'react-colorful'

export default function DrawingTools() {
    const {
        currentTool,
        currentColor,
        currentOpacity,
        currentStrokeWidth,
        setCurrentTool,
        setCurrentColor,
        setCurrentOpacity,
        setCurrentStrokeWidth,
    } = useDrawingTools()

    const toolLabel = currentTool === 'pen' ? 'Pen' : currentTool === 'eraser' ? 'Eraser' : 'Select'

    return (
        <div className="flex w-full flex-col gap-5">
            <div className="mb-3 flex items-center px-1 md:max-w-full">
                <h1 className="text-[0.85rem]">Tool</h1>
                <p className="ml-2 rounded-md bg-primary/10 p-[0.4rem] text-[0.8rem] text-dark/70">{toolLabel}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant={currentTool === 'select' ? 'default' : 'outline'}
                    className="rounded-lg"
                    onClick={() => setCurrentTool('select')}
                >
                    <MousePointer size={16} />
                </Button>
                <Button
                    variant={currentTool === 'pen' ? 'default' : 'outline'}
                    className="rounded-lg"
                    onClick={() => setCurrentTool('pen')}
                >
                    <Pen size={16} />
                </Button>
                <Button
                    variant={currentTool === 'eraser' ? 'default' : 'outline'}
                    className="rounded-lg"
                    onClick={() => setCurrentTool('eraser')}
                >
                    <Eraser size={16} />
                </Button>
            </div>

            <div className="space-y-2">
                <div className="mb-2 mt-2 flex items-center px-1 md:max-w-full">
                    <h1 className="text-[0.85rem]">Color</h1>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                        >
                            <Palette className="h-4 w-4" />
                            <span>{currentColor.toUpperCase()}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <HexColorPicker
                            color={currentColor}
                            onChange={setCurrentColor}
                        />
                        <div className="mt-4">
                            <HexColorInput
                                tabIndex={0}
                                prefix="#"
                                prefixed
                                color={currentColor}
                                onChange={setCurrentColor}
                                className="w-full rounded-md border px-2 py-1"
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <div className="mb-2 mt-2 flex items-center px-1 md:max-w-full">
                    <h1 className="text-[0.85rem]">Stroke Width</h1>
                    <p className="ml-2 rounded-md bg-primary/10 p-[0.4rem] text-[0.8rem] text-dark/70">{Math.round(currentStrokeWidth)}px</p>
                </div>
                <div className="mb-3 flex gap-4 text-[0.85rem] md:max-w-full">
                    <Slider
                        value={[currentStrokeWidth]}
                        onValueChange={([v]) => setCurrentStrokeWidth(v)}
                        onIncrement={() => setCurrentStrokeWidth(Math.min(32, currentStrokeWidth + 1))}
                        onDecrement={() => setCurrentStrokeWidth(Math.max(1, currentStrokeWidth - 1))}
                        min={1}
                        max={32}
                        step={1}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="mb-2 mt-2 flex items-center px-1 md:max-w-full">
                    <h1 className="text-[0.85rem]">Opacity</h1>
                    <p className="ml-2 rounded-md bg-primary/10 p-[0.4rem] text-[0.8rem] text-dark/70">{Math.round(currentOpacity * 100)}%</p>
                </div>
                <div className="mb-3 flex gap-4 text-[0.85rem] md:max-w-full">
                    <Slider
                        value={[currentOpacity]}
                        onValueChange={([v]) => setCurrentOpacity(v)}
                        onIncrement={() => setCurrentOpacity(Math.min(1, currentOpacity + 0.05))}
                        onDecrement={() => setCurrentOpacity(Math.max(0.1, currentOpacity - 0.05))}
                        min={0.1}
                        max={1}
                        step={0.05}
                    />
                </div>
            </div>
        </div>
    )
}
