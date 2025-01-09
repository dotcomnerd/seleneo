'use client'

import { type FileType } from '@/components/studio/export/types'
import * as htmlToImage from 'html-to-image'

export const getHtmlToImageConfig = (element: HTMLElement, scale: number) => {
    const originalPixelRatio = window.devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
        get: function () {
            return 1
        },
    })

    const config = {
        height: element.offsetHeight * scale,
        width: element.offsetWidth * scale,
        style: {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${element.offsetWidth}px`,
            height: `${element.offsetHeight}px`,
        },
        pixelRatio: 1,
    }

    Object.defineProperty(window, 'devicePixelRatio', {
        get: function () {
            return originalPixelRatio
        },
    })

    return config
}

export const createSnapshot = async (
    fileType: FileType,
    quality: number,
    scaleFactor: number
) => {
    const element = document?.getElementById('canvas-container')
    if (!element) {
        throw new Error('Canvas element not found')
    }

    const scale = scaleFactor * quality
    const config = getHtmlToImageConfig(element, scale)

    try {
        switch (fileType) {
            case 'JPG':
                return await htmlToImage.toJpeg(element, config)
            case 'PNG':
                return await htmlToImage.toBlob(element, config)
            case 'WEBP':
                const canvas = await htmlToImage.toCanvas(element, config)
                return canvas.toDataURL('image/webp')
            case 'SVG':
                return await htmlToImage.toSvg(element, config)
            default:
                throw new Error('Unsupported file type')
        }
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export const sendToCloudflare = async (file: Blob) => {
    
}

