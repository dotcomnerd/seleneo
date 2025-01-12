'use client';

import {
    AlertDialog,
    AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Frame, Home, Link as LinkIcon, User, X } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { toast } from 'sonner';

type ImageType = {
    id: string;
    cloudflareUrl: string;
    identifier: string;
    visibility: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
};

type ImageGalleryProps = {
    images: ImageType[];
    currentUserId: string;
    title: string;
    description: string;
};

export function ImageGallery({ images, currentUserId, title, description }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const breakpointColumns = {
        default: 4,
        1536: 4,
        1280: 3,
        1024: 3,
        768: 2,
        640: 1
    };

    return (
        <>
            <div className="min-h-screen">
                <Masonry
                    breakpointCols={breakpointColumns}
                    className="flex gap-[2px]"
                    columnClassName="flex flex-col gap-[2px] bg-background"
                >
                    <div className="relative bg-gradient-to-br from-primary/25 to-background rounded-lg p-6 flex flex-col justify-center border shadow-lg border-primary/50">
                        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {title}
                        </h1>
                        <p className="text-muted-foreground text-base">
                            {description}
                        </p>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Link href="/" className="absolute top-4 right-4 dark:text-white/50 dark:hover:text-white" title="Home">
                                <Home className="h-6 w-6" aria-label="Go to landing page" />
                            </Link>
                            <Link href="/studio" className="absolute top-12 right-4 dark:text-white/50 dark:hover:text-white" title="Studio">
                                <Frame className="h-6 w-6" aria-label="Go to studio" />
                            </Link>
                            {currentUserId && (
                                <Link href={`/${encodeURIComponent(currentUserId)}/profile`} className="absolute top-[5.2rem] right-4 dark:text-white/50 dark:hover:text-white" prefetch={true} title="Profile">
                                    <User className="h-6 w-6" aria-label="Go to profile" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className="relative cursor-pointer outline-none group"
                            onClick={() => setSelectedIndex(index)}
                            tabIndex={0}
                            role="button"
                            aria-label={`View image by ${image.user.name}`}
                        >
                            <img
                                src={image.cloudflareUrl}
                                alt={image.identifier}
                                className="w-full object-cover rounded-sm"
                                draggable={false}
                            />
                            <div className="absolute inset-0 rounded-sm bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={image.user.image ?? ""} />
                                            <AvatarFallback>
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white/80 text-sm truncate">
                                                {image.user.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Masonry>
                <ImageViewer images={images} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
            </div>
        </>
    );
}

interface ImageViewerProps {
    images: ImageType[];
    selectedIndex: number | null;
    setSelectedIndex: (index: number | null) => void;
}

export default function ImageViewer({ images, selectedIndex, setSelectedIndex }: ImageViewerProps) {
    const navigate = (newDirection: number) => {
        if (selectedIndex === null) return;
        setSelectedIndex((selectedIndex + newDirection + images.length) % images.length);
    };

    const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${filename}.webp`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            toast.error("Download failed", { description: "There was an error downloading the image. Please try again." });
        }
    };

    const copyToClipboard = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const item = new ClipboardItem({ 'image/webp': blob });
            await navigator.clipboard.write([item]);
            toast.success("Image copied", { description: "Image has been copied to clipboard" });
        } catch (error) {
            toast.error("Copy failed", { description: "Failed to copy image to clipboard" });
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedImage) return;
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'Escape') setSelectedIndex(null);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    return (
        <AlertDialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
            <AlertDialogContent className="max-w-4xl max-h-[90vh] p-6 bg-zinc-950">
                {selectedImage && (
                    <div className="relative flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled
                                    onClick={() => copyToClipboard(selectedImage.cloudflareUrl)}
                                    className="text-white/70 hover:text-white"
                                >
                                    <LinkIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDownload(selectedImage.cloudflareUrl, 'seleneo-community-export')}
                                    className="text-white/70 hover:text-white"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedIndex(null)}
                                className="text-white/70 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Image Container */}
                        <div className="relative flex-1 min-h-0">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(-1)}
                                    className="text-white/70 hover:text-white"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(1)}
                                    className="text-white/70 hover:text-white"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="mx-12 overflow-auto max-h-[calc(90vh-12rem)]">
                                <img
                                    src={selectedImage.cloudflareUrl}
                                    alt={selectedImage.identifier}
                                    className="w-full object-contain rounded"
                                    draggable={false}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 flex items-center gap-3">
                            <Link href={`/${selectedImage.user.name}/profile`} className="outline-none">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={selectedImage.user.image ?? ""} />
                                    <AvatarFallback>
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <div>
                                <Link
                                    href={`/${encodeURIComponent(selectedImage.user.name ?? "")}/profile`}
                                    className="text-sm font-medium text-white hover:underline outline-none"
                                >
                                    {selectedImage.user.name}
                                </Link>
                                <p className="text-xs text-white/60">
                                    {new Date(selectedImage.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
}