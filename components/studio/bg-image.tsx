
import { useBackgroundOptions } from '@/store/use-background-options'
import { Noise } from "@/components/noise"

export function BackgroundImageCanvas() {
    const { imageBackground } = useBackgroundOptions()

    return (
        <>
            {imageBackground && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    draggable={false}
                    className={`pointer-events-none absolute z-[0] h-full w-full object-cover`}
                    src={imageBackground}
                    alt="background image"
                />
            )}
            <Noise />
        </>
    )
}
