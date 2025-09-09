import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { calculateEqualCanvasSize } from '@/lib/utils'
import { createImageObject, uploadAndUpdateImage, cleanupAllBlobUrls } from '@/lib/image-upload'
import { useColorExtractor } from '@/store/use-color-extractor'
import { useImageOptions, useSelectedLayers } from '@/store/use-image-options'
import { useResizeCanvas } from '@/store/use-resize-canvas'
import { Plus, RotateCcw } from 'lucide-react'
import { ChangeEvent, useRef } from 'react'
import { toast } from 'sonner'

type AddImageButtonProps = object

export default function AddImageButton({ }: AddImageButtonProps) {
    const { setImages, images, defaultStyle, setInitialImageUploaded, setTexts } = useImageOptions()
    const { imagesCheck, setImagesCheck } = useColorExtractor()
    const uploadRef = useRef<HTMLInputElement>(null)
    const { automaticResolution, setResolution } = useResizeCanvas()
    const { setSelectedImage, setSelectedText } = useSelectedLayers()

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (file) {
            const imageId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1
            const isFirstImage = images.length === 0
            
            const newImage = createImageObject(file, imageId, defaultStyle, isFirstImage)
            
            const updatedImages = [...images, newImage]
            setImages(updatedImages)
            setImagesCheck([...imagesCheck, newImage.image!])
            
            if (localStorage.getItem('image-init-pro-tip') === null) {
                toast.info("Pro Trip!", { description: "If you right click on the image, you can replace it, delete it, or even crop it!", position: "top-left" });
                localStorage.setItem('image-init-pro-tip', 'true')
            }
            
            if (isFirstImage && automaticResolution) {
                const padding = 200
                const img = new Image()
                img.src = newImage.image!

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
            
            setSelectedImage(imageId)
            
            uploadAndUpdateImage(imageId, file, setImages, updatedImages)
        }
    }

    return (
        <div className="mb-3 hidden h-[4rem] gap-4 px-1 text-sm md:flex">
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="relative flex h-full flex-col rounded-xl border-2 border-primary/30 p-1 px-6 hover:border-primary/60">
                            <label
                                htmlFor="upload"
                                className="group flex h-full w-full cursor-pointer items-center justify-center rounded-xl"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        uploadRef.current?.click()
                                    }
                                }}
                            >
                                <div className='flex gap-1 items-center justify-center'>
                                    <Plus
                                        className="cursor-pointer text-primary/50 focus:ring-1 group-hover:text-primary/80"
                                        size={16}
                                    />
                                    <p className='text-muted-foreground'>Upload</p>
                                </div>
                            </label>
                            <input
                                id="upload"
                                ref={uploadRef}
                                name="upload"
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="sr-only"
                                tabIndex={-1}
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side={"top"}>
                        <span>Select an image to add to the canvas</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className="relative flex gap-2 h-full w-full cursor-pointer items-center justify-center rounded-xl border-2 border-primary/30 p-1 hover:border-primary/60"
                            onClick={() => {
                                cleanupAllBlobUrls(images)
                                setImages([])
                                setImagesCheck([])
                                setInitialImageUploaded(false)
                                setTexts([])
                                setSelectedImage(null)
                                setSelectedText(null)
                            }}
                        >
                            <div className='flex gap-1 items-center justify-center'>
                                <RotateCcw className="cursor-pointer text-primary/50 focus:ring-1 group-hover:text-primary/80" size={16} />
                                <p className='text-muted-foreground'>Reset</p>
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side={"top"}>
                        <span>Return to initial state</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}