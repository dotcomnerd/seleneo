'use client'
/* eslint-disable @next/next/no-img-element */

import { useEventListener } from '@/hooks/use-event-listener'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import {
    calculateEqualCanvasSize,
    convertHexToRgba,
} from '@/lib/utils'
import demoImage from '@/public/demo.png'
import lightDemoImage from '@/public/light-demo.png'
import { useBackgroundOptions } from '@/store/use-background-options'
import { useColorExtractor } from '@/store/use-color-extractor'
import { useFrameOptions } from '@/store/use-frame-options'
import { useImageOptions, useSelectedLayers } from '@/store/use-image-options'
import { useMoveable } from '@/store/use-moveable'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import { ImageIcon, Upload } from 'lucide-react'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import Dropzone from 'react-dropzone'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { BrowserFrame } from './browser-frames'
import ContextMenuImage from './image-context-menu'

function loadGoogleFont(fontFamily: string) {
    if (typeof window === 'undefined') return;
    const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`);
    if (existingLink) return;
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@200;300;400;500;600;700;800&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

const ImageUpload = () => {
    const targetRef = useRef<HTMLDivElement>(null)
    const {
        images,
        setImages,
        defaultStyle,
        setInitialImageUploaded,
        initialImageUploaded,
    } = useImageOptions()
    const { selectedImage, setSelectedImage } = useSelectedLayers()
    const { setShowControls, isSelecting, isMultipleTargetSelected } =
        useMoveable()
    //   const { exactDomResolution } = useResizeCanvas()
    //   const { width: exactDomWidth, height: exactDomHeight } =
    // splitWidthHeight(exactDomResolution)
    const { frameHeight, showStroke, arcDarkMode } = useFrameOptions()
    const { imagesCheck, setImagesCheck } = useColorExtractor()
    const { setResolution, automaticResolution } = useResizeCanvas()
    const { setBackground } = useBackgroundOptions()

    useEffect(() => {
        if (images.length === 0) return;
        setInitialImageUploaded(true)
        const extractColors = async () => {
            const analyze = (await import('rgbaster')).default

            const result = await analyze(images[images.length - 1].image, {
                scale: 0.5,
            })

            const extractedColors = result.slice(0, 12)

            setImages(
                images.map((image, index) =>
                    index === images.length - 1
                        ? {
                            ...image,
                            extractedColors,
                            // gradientColors,
                            style: {
                                ...image.style,
                                insetColor: extractedColors[0].color,
                            },
                        }
                        : image
                )
            )
        }
        extractColors()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imagesCheck])

    useOnClickOutside(targetRef, () => {
        if (isMultipleTargetSelected) return
        // setShowControls(false) TODO: More intelligently determine where "click outside" is, so we don't hide the controls when clicking on another image
        // 0.o - allow multi-select?
    })


    const handlePaste = useCallback(async (e: ClipboardEvent) => {
        e.preventDefault();
        const items = e.clipboardData?.items;
        if (!items) return;

        // @ts-ignore
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                if (!file) continue;
                const imageUrl = URL.createObjectURL(file);
                setImages([
                    ...images,
                    {
                        image: imageUrl,
                        id: images.length + 1,
                        style: images.length < 1
                            ? defaultStyle
                            : {
                                ...defaultStyle,
                                imageSize: '0.5',
                            },
                    },
                ]);
                setImagesCheck([...imagesCheck, imageUrl]);
                if (localStorage.getItem('image-init-pro-tip') === null) {
                    toast.info("Pro Tip!", { description: "If you right click on the image, you can replace it, delete it, or even crop it!", position: "top-center" });
                    localStorage.setItem('image-init-pro-tip', 'true')
                }
                if (images.length > 0) return;
                if (automaticResolution) {
                    const padding = 200;
                    const img = new Image();
                    img.src = imageUrl;
                    img.onload = () => {
                        const { naturalWidth, naturalHeight } = img;
                        const newResolution = calculateEqualCanvasSize(
                            naturalWidth,
                            naturalHeight,
                            padding
                        );
                        setResolution(newResolution.toString());
                    };
                }
            }
        }
    }, [images, imagesCheck, automaticResolution]);

    useEventListener('paste', handlePaste);

    return (
        <>
            {!initialImageUploaded && <LoadAImage />}
            {images && (
                <>
                    {images.map((image, index) => {
                        if (image.image !== '')
                            return (
                                <ContextMenuImage key={image.id + index}>
                                    <div
                                        className={`image image-check absolute z-[2] flex-1 overflow-hidden ${isSelecting ? 'selectable' : ''
                                            } ${selectedImage ? '' : ''}`}
                                        ref={
                                            !isMultipleTargetSelected
                                                ? image.id === selectedImage
                                                    ? targetRef
                                                    : null
                                                : targetRef
                                        }
                                        style={{
                                            // transition:
                                            //   'box-shadow 0.8s cubic-bezier(0.6, 0.6, 0, 1)',
                                            transformStyle: 'preserve-3d',
                                            transformOrigin: `50% 50%`,
                                            // rotate: `${image.style.rotate}deg`,
                                            // transform: `scale(${image.style.imageSize}) rotateX(${image.style.rotateX}deg) rotateY(${image.style.rotateY}deg) rotateZ(${image.style.rotateZ}deg) `,
                                            transform: `perspective(${image.style.perspective}px) translate(${image.style.translateX}%, ${image.style.translateY}%) scale(${image.style.imageSize}) rotate(${image.style.rotate}deg) rotateX(${image.style.rotateX}deg) rotateY(${image.style.rotateY}deg) rotateZ(${image.style.rotateZ}deg)`,
                                            borderRadius: `${image.style.imageRoundness}rem`,
                                            boxShadow:
                                                image.style.shadowName !== 'Medium'
                                                    ? `${image.style.imageShadow} ${convertHexToRgba(
                                                        image.style.shadowColor,
                                                        image.style.shadowOpacity
                                                    )}${image.frame === 'Shadow'
                                                        ? ',11px 11px rgba(0,0,0,0.8)'
                                                        : ''
                                                    }`
                                                    : `0px 18px 88px -4px ${convertHexToRgba(
                                                        image.style.shadowColor,
                                                        image.style.shadowOpacity
                                                    )}, 0px 8px 28px -6px ${convertHexToRgba(
                                                        image.style.shadowColor,
                                                        image.style.shadowOpacity
                                                    )}${image.frame === 'Shadow'
                                                        ? ',11px 11px rgba(0,0,0,0.8)'
                                                        : ''
                                                    }`,

                                            padding:
                                                image.frame !== 'None'
                                                    ? image.frame === 'Arc'
                                                        ? frameHeight === 'small'
                                                            ? '10px'
                                                            : frameHeight === 'medium'
                                                                ? '13px'
                                                                : '15px'
                                                        : ''
                                                    : `${image.style.insetSize}px`,

                                            backgroundColor:
                                                image.style.insetSize !== '0' && image.frame === 'None'
                                                    ? `${image?.style.insetColor}`
                                                    : image.frame === 'Arc'
                                                        ? arcDarkMode
                                                            ? '#00000050'
                                                            : '#ffffff50'
                                                        : image.frame === 'Shadow'
                                                            ? 'rgba(0,0,0,0.8)'
                                                            : 'transparent',

                                            border:
                                                image.frame === 'Arc'
                                                    ? arcDarkMode
                                                        ? '1px solid #00000020'
                                                        : '1px solid #ffffff60'
                                                    : image.frame === 'Shadow'
                                                        ? showStroke
                                                            ? '3px solid rgba(0,0,0,0.8)'
                                                            : ''
                                                        : '',

                                            zIndex: `${image.style.zIndex}`,
                                        }}
                                        id={`${image.id}`}
                                        onClick={() => {
                                            setShowControls(true)
                                            setSelectedImage(image.id)
                                        }}
                                        // on right click too do the same
                                        onContextMenu={() => {
                                            setShowControls(true)
                                            setSelectedImage(image.id)
                                        }}
                                    >
                                        <BrowserFrame frame={image.frame || 'None'} />

                                        <img
                                            draggable={false}
                                            className={`pointer-events-none h-full w-full shrink-0 ${image.frame === 'Arc' ? 'shadow-md' : ''
                                                }`}
                                            id={`img-${image.id}`}
                                            src={image.image}
                                            alt="Uploaded image"
                                            style={{
                                                borderRadius:
                                                    image.frame !== 'None'
                                                        ? image.frame === 'Arc'
                                                            ? `calc(${image.style.imageRoundness}rem - 9px)`
                                                            : ''
                                                        : `calc(${image.style.imageRoundness}rem - ${image.style.insetSize}px)`,

                                                padding:
                                                    image.frame === 'None'
                                                        ? ''
                                                        : `${image.style.insetSize}px`,

                                                backgroundColor:
                                                    image.style.insetSize !== '0' &&
                                                        image.frame !== 'None'
                                                        ? `${image?.style.insetColor}`
                                                        : '',
                                            }}
                                        />
                                    </div>
                                </ContextMenuImage>
                            )
                    })}
                </>
            )}
        </>
    )
}

export default ImageUpload

function LoadAImage() {
    const { images, setImages, setTexts, defaultStyle, setInitialImageUploaded, setScale } =
        useImageOptions()
    const { setSelectedImage } = useSelectedLayers()
    const { imagesCheck, setImagesCheck } = useColorExtractor()
    const { setResolution, automaticResolution, setCanvasRoundness, setScrollScale, setAutomaticResolution } = useResizeCanvas()
    const { setBackground, setImageBackground, setBackgroundType, setSolidColor, setAttribution, setHighResBackground, setIsBackgroundClicked, setNoise, setGradientAngle } = useBackgroundOptions()
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const handleImageLoad = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]

            if (file) {
                try {
                    const imageUrl = URL.createObjectURL(file)

                    setInitialImageUploaded(true)

                    setImagesCheck([...imagesCheck, imageUrl])
                    setImages([
                        ...images,
                        { image: imageUrl, id: images.length + 1, style: defaultStyle },
                    ])
                    setSelectedImage(images.length + 1)

                    if (localStorage.getItem('image-init-pro-tip') === null) {
                        toast.info("Pro Trip!", { description: "If you right click on the image, you can replace it, delete it, or even crop it!", position: "top-left" });
                        localStorage.setItem('image-init-pro-tip', 'true')
                    }

                    if (images.length > 0) return
                    if (automaticResolution) {
                        const padding = 200
                        const img = new Image()
                        img.src = imageUrl

                        img.onload = () => {
                            const { naturalWidth, naturalHeight } = img
                            const newResolution = calculateEqualCanvasSize(
                                naturalWidth,
                                naturalHeight,
                                padding
                            )
                            setResolution(newResolution.toString())
                        }
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        toast.error(error.message, { position: "top-left" });
                    } else {
                        toast.error("An unknown error occurred when loading the image", { position: "top-left" });
                    }
                }
            }
        },
        [
            setInitialImageUploaded,
            setImagesCheck,
            imagesCheck,
            setImages,
            images,
            defaultStyle,
            setSelectedImage,
            automaticResolution,
            setResolution,
        ]
    )

    const handleImageChange = useCallback(
        (file: File | undefined) => {
            // const file = event.target.files?.[0]
            if (file) {
                try {
                    const imageUrl = URL.createObjectURL(file)
                    setInitialImageUploaded(true)

                    setImagesCheck([...imagesCheck, imageUrl])
                    setImages([
                        ...images,
                        { image: imageUrl, id: images.length + 1, style: defaultStyle },
                    ])
                    setSelectedImage(images.length + 1)

                    if (localStorage.getItem('image-init-pro-tip') === null) {
                        toast.info("Pro Trip!", { description: "If you right click on the image, you can replace it, delete it, or even crop it!", position: "top-left" });
                        localStorage.setItem('image-init-pro-tip', 'true')
                    }

                    if (images.length > 0) return
                    if (automaticResolution) {
                        const padding = 250
                        const img = new Image()
                        img.src = imageUrl

                        img.onload = () => {
                            const { naturalWidth, naturalHeight } = img
                            const newResolution = calculateEqualCanvasSize(
                                naturalWidth,
                                naturalHeight,
                                padding
                            )
                            setResolution(newResolution.toString())
                        }
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        toast.error(error.message, { position: "top-left" });
                    } else {
                        toast.error("An unknown error occurred when loading the image", { position: "top-left" });
                    }
                    return;
                }
            }
        },
        [
            setInitialImageUploaded,
            setImagesCheck,
            imagesCheck,
            setImages,
            images,
            defaultStyle,
            setSelectedImage,
            automaticResolution,
            setResolution,
        ]
    )

    const loadDemoImage = async (theme: "light" | "dark") => {
        if (typeof window === 'undefined') return;

        try {
            const imageSrc = theme === 'light' ? lightDemoImage.src : demoImage.src;
            const image = new Image();
            image.crossOrigin = 'Anonymous';
            image.src = imageSrc;

            image.onload = async () => {
                // NOTE: commenting for visit later, i don't really like the gradient - the idea of extracting colors is cool though
                // const colorThief = new ColorThief();
                // const palette = await colorThief.getPalette(image, 5);
                // const gradientStops = palette
                //     .map((clr, i) => `rgb(${clr.join(',')}) ${Math.floor((i / (palette.length - 1)) * 100)}%`)
                //     .join(', ');
                // const gradient = `linear-gradient(var(--gradient-angle), ${gradientStops})`;

                // setBackground(gradient);
                // document?.documentElement.style.setProperty('--gradient-bg', gradient);

                setImages([
                    ...images,
                    {
                        image: imageSrc,
                        id: 1,
                        style: {
                            ...defaultStyle,
                            imageRoundness: 0.7,
                            imageSize: '0.78',
                        },
                    },
                ]);
                setImagesCheck([...imagesCheck, imageSrc]);

                if (localStorage.getItem('image-init-pro-tip') === null) {
                    toast.info("Pro Trip!", { description: "If you right click on the image, you can replace it, delete it, or even crop it!", position: "top-left" });
                    localStorage.setItem('image-init-pro-tip', 'true')
                }

                setResolution('1920x1080');
            };
        } catch (error) {
            console.error("Failed to load demo image:", error);
        }
    };

    const loadDemoImageFromJson = async () => {
        if (typeof window === 'undefined') return;
        try {
            const canvasState = localStorage.getItem('canvasState');
            if (canvasState !== null) {
                const { images, texts, backgroundSettings, canvasSettings } = JSON.parse(canvasState);
                // TODO: redo section to not use so many if statements :buster:
                if (images && images.length > 0) {
                    setImages([...images]);
                    setImagesCheck([...imagesCheck, ...images.map((image: any) => image.image)]);
                }

                if (texts && texts.length > 0) {
                    setTexts([...texts]);

                    // need to load any custom fonts that were saved
                    texts.forEach((text: any) => {
                        if (text.style?.fontFamily && text.style.fontFamily !== 'Inter') {
                            loadGoogleFont(text.style.fontFamily);
                        }
                    });
                }
                if (backgroundSettings) {
                    if (backgroundSettings.backgroundColor) {
                        setBackground(backgroundSettings.backgroundColor);
                    }
                    if (backgroundSettings.backgroundType === 'solid') {
                        document?.documentElement.style.setProperty('--solid-bg', backgroundSettings.backgroundColor);
                        document?.documentElement.style.setProperty('--gradient-bg', backgroundSettings.backgroundColor);
                        document?.documentElement.style.setProperty('--mesh-bg', backgroundSettings.backgroundColor);
                    } else if (backgroundSettings.backgroundType === 'gradient') {
                        document?.documentElement.style.setProperty('--gradient-bg', backgroundSettings.backgroundColor);
                    } else if (backgroundSettings.backgroundType === 'mesh') {
                        document?.documentElement.style.setProperty('--mesh-bg', backgroundSettings.backgroundColor);
                    }
                    if (backgroundSettings.imageBackground) {
                        setImageBackground(backgroundSettings.imageBackground);
                    }
                    if (backgroundSettings.noise !== undefined) {
                        setNoise(backgroundSettings.noise);
                    }
                    if (backgroundSettings.gradientAngle !== undefined) {
                        setGradientAngle(backgroundSettings.gradientAngle);
                    }
                    if (backgroundSettings.solidColor) {
                        setSolidColor(backgroundSettings.solidColor);
                    }
                    if (backgroundSettings.attribution) {
                        setAttribution(backgroundSettings.attribution);
                    }
                    if (backgroundSettings.highResBackground !== undefined) {
                        setHighResBackground(backgroundSettings.highResBackground);
                    }
                    if (backgroundSettings.isBackgroundClicked !== undefined) {
                        setIsBackgroundClicked(backgroundSettings.isBackgroundClicked);
                    }
                }

                if (canvasSettings) {
                    if (canvasSettings.scale !== undefined) {
                        setScale(canvasSettings.scale);
                    }
                    if (canvasSettings.resolution) {
                        setResolution(canvasSettings.resolution);
                    }
                    if (canvasSettings.canvasRoundness !== undefined) {
                        setCanvasRoundness(canvasSettings.canvasRoundness);
                    }
                    if (canvasSettings.scrollScale !== undefined) {
                        setScrollScale(canvasSettings.scrollScale);
                    }
                    if (canvasSettings.automaticResolution !== undefined) {
                        setAutomaticResolution(canvasSettings.automaticResolution);
                    }
                }

                toast.success("Local State Restored Successfully", { position: "top-left" });
                return;
            }

        } catch (error) {
            toast.error("Error Loading Saved State", { position: "top-left" });
        }
    };

    return (
        <Dropzone
            multiple={false}
            onDrop={(acceptedFiles) => {
                handleImageChange(acceptedFiles[0])
            }}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            noClick
        >
            {({ getRootProps, getInputProps }) => (
                <div
                    {...getRootProps()}
                    className="absolute-center h-25 w-4/5 xl:w-2/5"
                >
                    <div className="flex flex-col gap-4 rounded-xl text-center">
                        <div className="flex-center flex-col rounded-xl border-2 border-dashed border-primary/40 backdrop-blur-md bg-background/70 shadow-xl px-4 py-10 transition-all duration-300 hover:border-border/70 hover:bg-background/70">
                            <Upload
                                style={{
                                    transition: 'all 0.8s cubic-bezier(0.6, 0.6, 0, 1)',
                                }}
                                className={`mx-auto mb-2 hidden h-10 w-10 text-muted-foreground sm:block ${isDragging ? 'rotate-180' : 'rotate-0'
                                    }`}
                                aria-hidden="true"
                            />
                            <div className="flex-center mt-4 text-base leading-6 text-muted-foreground">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md font-bold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:underline dark:hover:text-primary hover:text-primary"
                                >
                                    <span>Load an image</span>
                                </label>
                                <input {...getInputProps()} />
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    onChange={handleImageLoad}
                                    accept="image/*"
                                    className="sr-only"
                                />
                                <p className="hidden pl-1 font-medium text-muted-foreground lg:block">
                                    or drag and drop
                                </p>
                            </div>

                            <p className="mt-4 hidden text-xs text-muted-foreground sm:block">
                                or try an example
                            </p>

                            <div className='flex-center gap-4 scale-90'>
                                <Button
                                    onClick={() => loadDemoImage('light')}
                                    className="z-[120] max-w-52 mt-4 hidden rounded-md bg-background/80 backdrop-blur-sm text-primary shadow-sm hover:bg-background/90 sm:inline-flex"
                                    variant="outline"
                                >
                                    Light mode demo
                                    <ImageIcon className="ml-2" size={19} />
                                </Button>
                                <Button
                                    onClick={() => loadDemoImage('dark')}
                                    className="z-[120] max-w-52 mt-4 hidden rounded-md bg-background/80 backdrop-blur-sm text-primary shadow-sm hover:bg-background/90 sm:inline-flex"
                                    variant="outline"
                                >
                                    Dark mode demo
                                    <ImageIcon className="ml-2" size={19} />
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Dropzone>
    )
}
