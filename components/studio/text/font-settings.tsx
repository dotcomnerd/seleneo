'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent
} from '@/components/ui/card'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useImageOptions, useSelectedLayers } from '@/store/use-image-options'
import { useMoveable } from '@/store/use-moveable'
import {
    AlignHorizontalJustifyCenter,
    AlignLeft,
    AlignRight,
    GalleryVerticalEnd,
    Minus,
    Palette,
    Plus,
} from 'lucide-react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import FontPicker from './font-picker'

export default function FontSettings() {
    const { setTexts, texts } = useImageOptions()
    const { selectedText } = useSelectedLayers()
    const { setShowTextControls } = useMoveable()

    const handleColorChange = (color: string) => {
        selectedText &&
            setTexts(
                texts.map((text) =>
                    text.id === selectedText
                        ? {
                            ...text,
                            style: {
                                ...text.style,
                                textColor: color,
                            },
                        }
                        : text
                )
            )
    }

    const handleShadowColorChange = (color: string) => {
        selectedText &&
            setTexts(
                texts.map((text) =>
                    text.id === selectedText
                        ? {
                            ...text,
                            style: {
                                ...text.style,
                                shadowColor: color,
                            },
                        }
                        : text
                )
            )
    }

    const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
        selectedText &&
            setTexts(
                texts.map((text) =>
                    text.id === selectedText
                        ? {
                            ...text,
                            style: {
                                ...text.style,
                                textAlign: alignment,
                            },
                        }
                        : text
                )
            )
    }

    const handleFontWeight = (weight: number) => {
        selectedText &&
            setTexts(
                texts.map((text) =>
                    text.id === selectedText
                        ? {
                            ...text,
                            style: {
                                ...text.style,
                                fontWeight: weight,
                            },
                        }
                        : text
                )
            )
    }

    return (
        <Card className="border-none shadow-none">
            <CardContent className="p-4">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Font Family</h3>
                        <FontPicker
                            apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY!}
                            activeFontFamily={selectedText ? texts.find(t => t.id === selectedText)?.style.fontFamily : 'Inter'}
                            variants={['200', '300', 'regular', '500', '600', '700', '800']}
                            onChange={(font) => {
                                selectedText &&
                                    setTexts(
                                        texts.map((text, index) =>
                                            text.id === selectedText
                                                ? {
                                                    ...text,
                                                    style: {
                                                        ...text.style,
                                                        fontFamily: font.family,
                                                    },
                                                }
                                                : text
                                        )
                                    )
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Weight</h3>
                        <div className="flex h-9 items-center rounded-md border border-border bg-transparent">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-none rounded-l-md border-r px-2"
                                onClick={() =>
                                    selectedText && (texts.find(t => t.id === selectedText)?.style.fontWeight ?? 0) > 200
                                        ? handleFontWeight((texts.find(t => t.id === selectedText)?.style.fontWeight ?? 0) - 100)
                                        : handleFontWeight(200)
                                }
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <div className="flex-1 text-center text-sm">
                                {selectedText ? texts.find(t => t.id === selectedText)?.style.fontWeight : 400}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-none rounded-r-md border-l px-2"
                                onClick={() =>
                                    selectedText && (texts.find(t => t.id === selectedText)?.style.fontWeight ?? 0) < 800
                                        ? handleFontWeight((texts.find(t => t.id === selectedText)?.style.fontWeight ?? 0) + 100)
                                        : handleFontWeight(800)
                                }
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Color</h3>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                >
                                    <Palette className="h-4 w-4" />
                                    {selectedText ? texts.find(t => t.id === selectedText)?.style.textColor : '#fff'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64">
                                <HexColorPicker
                                    color={selectedText ? texts.find(t => t.id === selectedText)?.style.textColor : '#fff'}
                                    onChange={handleColorChange}
                                />
                                <div className="mt-4">
                                    <HexColorInput
                                        color={selectedText ? texts.find(t => t.id === selectedText)?.style.textColor : '#fff'}
                                        onChange={handleColorChange}
                                        className="w-full rounded-md border px-2 py-1"
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Letter Spacing</h3>
                            <span className="text-sm text-muted-foreground">
                                {selectedText
                                    ? Math.round((texts.find(t => t.id === selectedText)?.style.letterSpacing ?? 0) * 100) / 100
                                    : 0}
                            </span>
                        </div>
                        <Slider
                            defaultValue={[0]}
                            max={0.2}
                            min={-0.05}
                            step={0.001}
                            onIncrement={() => { }}
                            onDecrement={() => { }}
                            value={
                                texts.length !== 0 && selectedText
                                    ? [+(texts.find(t => t.id === selectedText)?.style.letterSpacing ?? 0)]
                                    : [0]
                            }
                            onValueChange={(value: number[]) => {
                                setShowTextControls(false)
                                selectedText &&
                                    setTexts(
                                        texts.map((text, index) =>
                                            text.id === selectedText
                                                ? {
                                                    ...text,
                                                    style: {
                                                        ...text.style,
                                                        letterSpacing: value[0],
                                                    },
                                                }
                                                : text
                                        )
                                    )
                            }}
                            onValueCommit={() => setShowTextControls(true)}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Alignment</h3>
                        <div className="flex gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleAlignmentChange('left')}
                                        >
                                            <AlignLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Left align</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleAlignmentChange('center')}
                                        >
                                            <AlignHorizontalJustifyCenter className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Center align</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleAlignmentChange('right')}
                                        >
                                            <AlignRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Right align</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <GalleryVerticalEnd className="rotate-90 h-4 w-4" />
                            <h3 className="text-sm font-medium uppercase">Text Shadow</h3>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">Opacity</h3>
                                <span className="text-sm text-muted-foreground">
                                    {Math.round(
                                        Number(selectedText ? texts.find(t => t.id === selectedText)?.style.shadowOpacity : 0.1) * 100
                                    )}
                                    %
                                </span>
                            </div>
                            <Slider
                                defaultValue={[0.1]}
                                min={0}
                                max={1}
                                step={0.01}
                                onIncrement={() => { }}
                                onDecrement={() => { }}
                                value={
                                    texts.length !== 0 && selectedText
                                        ? [texts.find(t => t.id === selectedText)?.style.shadowOpacity ?? 0]
                                        : [0.1]
                                }
                                onValueChange={(value) => {
                                    selectedText &&
                                        setTexts(
                                            texts.map((text, index) =>
                                                text.id === selectedText
                                                    ? {
                                                        ...text,
                                                        style: {
                                                            ...text.style,
                                                            shadowOpacity: value[0],
                                                        },
                                                    }
                                                    : text
                                            )
                                        )
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Shadow Color</h3>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2"
                                    >
                                        <Palette className="h-4 w-4" />
                                        {selectedText ? texts.find(t => t.id === selectedText)?.style.shadowColor : '#333'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                    <HexColorPicker
                                        color={selectedText ? texts.find(t => t.id === selectedText)?.style.shadowColor : '#333'}
                                        onChange={handleShadowColorChange}
                                    />
                                    <div className="mt-4">
                                        <HexColorInput
                                            color={selectedText ? texts.find(t => t.id === selectedText)?.style.shadowColor : '#333'}
                                            onChange={handleShadowColorChange}
                                            className="w-full rounded-md border px-2 py-1"
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}