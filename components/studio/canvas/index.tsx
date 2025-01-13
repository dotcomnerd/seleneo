'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { resolutions } from '@/presets/resolutions'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import {
    ArrowRight,
    Dribbble,
    Facebook,
    InfoIcon,
    Instagram,
    Linkedin,
    Minus,
    Plus,
    Youtube
} from 'lucide-react'
import { useEffect, useLayoutEffect, useState } from 'react'
import { FaXTwitter } from 'react-icons/fa6'
import CanvasRoundnessSlider from './canvas-roundness-slider'
import { ResolutionButton } from './resolution-button'

const icons = {
    Youtube: <Youtube size={18} />,
    Instagram: <Instagram size={18} />,
    Facebook: <Facebook size={18} />,
    LinkedIn: <Linkedin size={18} />,
    X: <FaXTwitter size={18} />,
    Dribble: <Dribbble size={18} />,
    ProductHunt: (
        <div className="flex-center h-6 w-6 rounded-full bg-[#898aeb]/5">P</div>
    ),
}

const splitResolution = (resolution: string) => resolution.split('x')

export default function CanvasOptions() {
    const {
        setResolution,
        domResolution,
        scrollScale,
        setScrollScale,
        automaticResolution,
        setAutomaticResolution,
    } = useResizeCanvas()

    const [width, height] = splitResolution(domResolution)

    const [inputResolution, setInputResolution] = useState({
        inputWidth: width,
        inputHeight: height,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setResolution(
            `${inputResolution.inputWidth}x${inputResolution.inputHeight}`
        )
    }

    useLayoutEffect(() => {
        setInputResolution({
            inputWidth: `${Math.round(+width)}`,
            inputHeight: `${Math.round(+height)}`,
        })
    }, [height, width])

    return (
        <>
            <div className="mt-4 flex w-full justify-between px-1">
                <div className="justify-center items-center gap-2 flex">
                    <h1 className="text-[0.85rem]">Auto Resolution</h1>
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger>
                                <InfoIcon className="size-4 stroke-primary/70" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[12rem]">
                                <p>
                                    When enabled, the canvas will automatically resize to fit your
                                    image on upload.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Switch
                    checked={automaticResolution}
                    onCheckedChange={(checked) => {
                        setAutomaticResolution(checked)
                    }}
                />
            </div>

            <hr className="my-4 border-border" />

            <h1 className="mb-3 mt-8 px-1 text-[0.85rem]">Custom Resolution</h1>
            <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-sm items-center space-x-2"
            >
                <Input
                    type="number"
                    value={inputResolution.inputWidth}
                    placeholder='Width'
                    min={100}
                    max={5000}
                    onChange={(e) => {
                        setInputResolution({
                            ...inputResolution,
                            inputWidth: e.target.value,
                        })
                    }}
                    className="rounded-lg text-sm border border-primary/30"
                />
                <span className="mx-2 my-auto">x</span>
                <Input
                    type="number"
                    value={inputResolution.inputHeight}
                    placeholder='Height'
                    min={100}
                    max={5000}
                    className="rounded-lg text-sm border border-primary/30"
                    onChange={(e) => {
                        setInputResolution({
                            ...inputResolution,
                            inputHeight: e.target.value,
                        })
                    }}
                />
                <Button
                    type="submit"
                    variant="outline"
                    className="border border-primary/30 rounded-lg px-3 text-sm"
                >
                    <ArrowRight size={18} />
                </Button>
            </form>

            <h1 className="mb-3 mt-8 px-1 text-[0.85rem]">Resolutions</h1>
            <div className="flex flex-wrap gap-3">
                {resolutions.map((res, index) => (
                    <ResolutionButton
                        key={index}
                        resolutions={res?.resolutions}
                        name={res?.name}
                        icon={icons[res?.icon as keyof typeof icons]}
                        color={res.color}
                        variant="stylish"
                        className="rounded-lg"
                    />
                ))}
            </div>
            <Separator className="mt-8 h-[0.1rem] w-full" />

            <CanvasRoundnessSlider />

            <Separator className="mt-8 h-[0.1rem] w-full" />

            <h1 className="mb-3 mt-4 px-1 text-[0.85rem]">Preview Scale</h1>
            <span className="inline-flex rounded-md shadow-sm space-x-4">
                <Button
                    variant={"outline"}
                    className='border border-primary/30'
                    disabled={scrollScale === 1}
                    onClick={() => {
                        if (scrollScale === 1) return
                        setScrollScale(scrollScale + 0.1)
                    }}
                >
                    <span className="sr-only">Scale Up</span>
                    <Plus className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button
                    variant={"outline"}
                    className='border border-primary/30'
                    disabled={scrollScale <= 0.4}
                    onClick={() => {
                        if (scrollScale <= 0.4) return
                        setScrollScale(scrollScale - 0.1)
                    }}
                >
                    <span className="sr-only">Scale Down</span>
                    <Minus className="h-5 w-5" aria-hidden="true" />
                </Button>
            </span>
        </>
    )
}
