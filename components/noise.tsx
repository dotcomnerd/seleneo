import { useBackgroundOptions } from '@/store/use-background-options'
import noiseSvg from "@/public/noise.svg";

export function Noise() {
    const { noise, isBackgroundClicked } = useBackgroundOptions()
    return (
        <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {isBackgroundClicked && <img
                draggable={false}
                className={`pointer-events-none absolute z-[0] h-full w-full object-cover`}
                style={{
                    opacity: noise,
                }}
                src={noiseSvg}
                alt="noise"
                loading="lazy"
            />}
        </>
    )
}
