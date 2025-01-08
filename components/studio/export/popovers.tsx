'use client'

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FILE_TYPES, FileType, QUALITY_OPTIONS } from "./types"

export function ExportQualityPopover({
    quality,
    setQuality
}: {
    quality: number
    setQuality: (quality: number) => void
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="px-3 font-medium">
                    {quality}x
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[200px] p-2">
                <div className="flex flex-col gap-1">
                    {QUALITY_OPTIONS.map((option) => (
                        <Button
                            key={option.value}
                            variant={quality === option.value ? "secondary" : "ghost"}
                            className="justify-start font-normal"
                            onClick={() => setQuality(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export function FileTypePopover({
    fileType,
    setFileType
}: {
    fileType: FileType
    setFileType: (type: FileType) => void
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="px-3 font-medium">
                    {fileType}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[120px] p-2">
                <div className="flex flex-col gap-1">
                    {FILE_TYPES.map((type) => (
                        <Button
                            key={type}
                            variant={fileType === type ? "secondary" : "ghost"}
                            className="justify-start font-normal"
                            onClick={() => setFileType(type)}
                        >
                            .{type}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}