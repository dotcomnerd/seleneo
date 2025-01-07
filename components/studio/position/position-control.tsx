'use client'

import { useImageOptions, useSelectedLayers } from '@/store/use-image-options'
import {
    ArrowDown,
    ArrowDownLeft,
    ArrowDownRight,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ArrowUpLeft,
    ArrowUpRight,
    CircleDot,
} from 'lucide-react'
import { useCallback, useEffect } from 'react'

export default function PositionControl() {
    const { images, setImages } = useImageOptions()
    const { selectedImage } = useSelectedLayers()

    const move = useCallback(
        (deltaX: number, deltaY: number) => {
            selectedImage &&
                setImages(
                    images.map((image, index) =>
                        index === selectedImage - 1
                            ? {
                                ...image,
                                style: {
                                    ...image.style,
                                    translateX:
                                        images[selectedImage - 1]?.style.translateX + deltaX,
                                    translateY:
                                        images[selectedImage - 1]?.style.translateY + deltaY,
                                },
                            }
                            : image
                    )
                )
        },
        [images, setImages, selectedImage]
    )

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    move(0, -5)
                    break
                case 'ArrowDown':
                    move(0, 5)
                    break
                case 'ArrowLeft':
                    move(-5, 0)
                    break
                case 'ArrowRight':
                    move(5, 0)
                    break
                default:
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [move])

    const centerImage = () => {
        selectedImage &&
            setImages(
                images.map((image, index) =>
                    index === selectedImage - 1
                        ? {
                            ...image,
                            style: {
                                ...image.style,
                                translateX: 0,
                                translateY: 0,
                            },
                        }
                        : image
                )
            )
    }

    return (
        <div className="w-full flex justify-center items-center">
            <div
                className={`relative grid h-40 w-full grid-cols-3 overflow-hidden rounded-lg border bg-card [&>*]:cursor-pointer [&>*]:border-dashed [&>*]:border-border [&>*]:transition-colors ${selectedImage ? '' : 'pointer-events-none opacity-40'}`}
            >
                <button
                    className="flex items-center justify-center border-b-2 border-r-2 hover:bg-muted"
                    aria-label="Translate up left"
                    onClick={() => move(-5, -5)}
                >
                    <ArrowUpLeft size={21} aria-hidden />
                </button>
                <button
                    className="flex items-center justify-center border-b-2 border-r-2 hover:bg-muted"
                    aria-label="Translate up"
                    onClick={() => move(0, -5)}
                >
                    <ArrowUp size={21} aria-hidden />
                </button>
                <button
                    className="flex items-center justify-center border-b-2 hover:bg-muted"
                    aria-label="Translate up right"
                    onClick={() => move(5, -5)}
                >
                    <ArrowUpRight size={21} aria-hidden />
                </button>
                <button
                    className="flex items-center justify-center border-b-2 border-r-2 hover:bg-muted"
                    aria-label="Translate left"
                    onClick={() => move(-5, 0)}
                >
                    <ArrowLeft size={21} aria-hidden />
                </button>
                <button
                    className="flex items-center justify-center border-b-2 border-r-2 hover:bg-muted"
                    aria-label="Center image"
                    onClick={centerImage}
                >
                    <CircleDot size={21} aria-hidden />
                </button>
                <button
                    className="flex items-center justify-center border-b-2 hover:bg-muted"
                    aria-label="Translate right"
                    onClick={() => move(5, 0)}
                >
                    <ArrowRight size={21} aria-hidden />
                </button>
                <button
                    className="flex items-center justify-center border-r-2 hover:bg-muted"
                    aria-label="Translate down left"
                    onClick={() => move(-5, 5)}
                >
                    <ArrowDownLeft size={21} aria-hidden />
                </button>
                <button
                    className="flex items-center justify-center border-r-2 hover:bg-muted"
                    aria-label="Translate down"
                    onClick={() => move(0, 5)}
                >
                    <ArrowDown size={21} aria-hidden />
                </button>
                <button
                    className="flex items-center justify-center hover:bg-muted"
                    aria-label="Translate down right"
                    onClick={() => move(5, 5)}
                >
                    <ArrowDownRight size={21} aria-hidden />
                </button>
            </div>
        </div>

    )
}
