"use client";

import BackgroundOptions from '@/components/studio/background';
import CanvasOptions from '@/components/studio/canvas';
import FrameOptions from '@/components/studio/frame';
import ImageOptions from '@/components/studio/image';
import PerspectiveOptions from '@/components/studio/perspective';
import PositionOptions from '@/components/studio/position';
import TextOptions from '@/components/studio/text';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useActiveIndexStore } from '@/store/use-active-index';

export default function MobileViewImageOptions() {
    const { activeIndex } = useActiveIndexStore()

    return (
        <ScrollArea className="mt-6 w-full md:hidden" type="auto">
            <div className="w-full max-w-[90%] md:hidden">
                {activeIndex === 0 && <CanvasOptions />}
                {activeIndex === 1 && <ImageOptions />}
                {activeIndex === 2 && <BackgroundOptions />}
                {activeIndex === 3 && <FrameOptions />}
                {activeIndex === 4 && <TextOptions />}
                {activeIndex === 5 && <PerspectiveOptions />}
                {activeIndex === 6 && <PositionOptions />}
            </div>
        </ScrollArea>
    )
}
