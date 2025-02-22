'use client'

import { cn } from '@/lib/utils'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { MinusIcon, Plus } from 'lucide-react'
import * as React from 'react'
import { Button } from './button'

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
        onIncrement: () => void
        onDecrement: () => void
    }
>(({ className, onIncrement, onDecrement, ...props }, ref) => (
    <div className="flex w-full items-center gap-2.5">
        <Button
            variant="ghost"
            className="h-6 rounded-md border border-border/80 bg-primary/5 p-0.5"
            onClick={onDecrement}
        >
            <MinusIcon className="h-[1.15rem] w-[1.15rem] dark:text-primary/80 text-primary/40" />
        </Button>
        <SliderPrimitive.Root
            ref={ref}
            className={cn(
                'relative flex w-full touch-none select-none items-center  disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-[3px] bg-primary/15 disabled:opacity-50">
                <SliderPrimitive.Range className="dark:bg-primary absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
                aria-label="slider thumb"
                className="block h-5 w-5 rounded-md border border-border bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:outline-none active:ring-2 active:ring-ring active:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary"
            />
        </SliderPrimitive.Root>
        <Button
            variant="ghost"
            className="h-6 rounded-md border border-border/80 bg-primary/5 p-0.5"
            onClick={onIncrement}
        >
            <Plus className="h-[1.15rem] w-[1.15rem] dark:text-primary/80 text-primary/40" />
        </Button>
    </div>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
