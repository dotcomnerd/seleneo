"use client";

import dynamic from 'next/dynamic'
import { Type } from 'lucide-react'
import { useSelectedLayers } from '@/store/use-image-options'

const AddTextLayer = dynamic(() => import('./add-text-layer'), {
    ssr: false
})

const FontSettings = dynamic(() => import('./font-settings'), {
    ssr: false
})

const TextOptions = () => {
    const { selectedText } = useSelectedLayers()

    return (
        <div className="flex w-full flex-col gap-8">
            <AddTextLayer />

            <h3 className="flex items-center gap-2 text-xs font-medium uppercase text-dark/70">
                <Type size={20} />
                <span>Appearance</span>
            </h3>
            <div className={`${selectedText ? '' : 'opacity-40 pointer-events-none'}`}>
                <FontSettings />
            </div>
        </div>
    )
}

export default dynamic(() => Promise.resolve(TextOptions), {
    ssr: false
})