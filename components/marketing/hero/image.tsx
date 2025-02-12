"use client";

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { InfoIcon, Lock } from 'lucide-react';
import { useState } from 'react';
import { BouncingText } from './bouncing-text';
import { BlueToggle } from './toggle';

export default function HeroImage() {
    const [imageOrBounce, setImageOrBounce] = useState<'image' | 'bounce'>('image');

    return (
        <div className="md:block relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 dark:opacity-50 opacity-30 dark:blur-2xl blur-3xl" />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 overflow-x-auto">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 mx-4 min-w-0">
                        <div className="w-full h-6 rounded bg-gray-100 dark:bg-gray-800 flex flex-row items-center justify-start pl-2 space-x-1">
                            <div>
                                <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                                <InfoIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="truncate">
                                <span className="text-sm text-gray-400 ml-1 tracking-tight font-mono">https://freedesign.fyi/studio</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="-ml-4 text-sm text-gray-500">click me 🥚</label>
                        <BlueToggle
                            checked={imageOrBounce === 'bounce'}
                            onChange={(e) => setImageOrBounce(e.target.checked ? 'bounce' : 'image')}
                        />
                    </div>
                </div>
                <div className="relative">
                    <AspectRatio ratio={16 / 9} />
                    <BouncingText speed={1.54} state={imageOrBounce} />
                </div>
            </div>
        </div>
    );
}