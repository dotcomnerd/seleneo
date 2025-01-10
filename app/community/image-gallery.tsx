'use client';

import { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, User, X, Link as LinkIcon } from 'lucide-react';
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
    currentUserId?: string;
    title: string;
    description: string;
};

export function ImageGallery({ images, currentUserId, title, description }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/25 to-background rounded-lg p-6 flex flex-col justify-center border shadow-lg border-primary/50">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    <p className="text-muted-foreground text-base">
                        {description}
                    </p>
                </div>

                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="group relative cursor-pointer outline-none"
                        onClick={() => setSelectedIndex(index)}
                        tabIndex={0}
                        role="button"
                        aria-label={`View image by ${image.user.name}`}
                    >
                        <AspectRatio ratio={4 / 3}>
                            <img
                                src={image.cloudflareUrl}
                                alt={image.identifier}
                                className="object-cover w-full h-full rounded-lg"
                                draggable={false}
                            />
                        </AspectRatio>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
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
            </div>

            <AlertDialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
                <AlertDialogContent
                    className="max-w-3xl p-0 overflow-hidden outline-none bg-zinc-950"
                >
                    {selectedImage && (
                        <div className="relative h-full select-none">
                            <div className="h-12 absolute top-0 inset-x-0 flex items-center justify-between px-4 bg-background/5">
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard(selectedImage.cloudflareUrl)}
                                        className="h-8 w-8 text-white/70 hover:text-white z-50"
                                        aria-label="Copy image"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDownload(selectedImage.cloudflareUrl, `seleneo-community-export`)}
                                        className="h-8 w-8 text-white/70 hover:text-white"
                                        aria-label="Download image"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedIndex(null)}
                                    className="h-8 w-8 text-white/70 hover:text-white z-50"
                                    aria-label="Close dialog"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="absolute left-0 inset-y-0 w-16 flex items-center justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(-1)}
                                    className="h-8 w-8 text-white/70 hover:text-white"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="absolute right-0 inset-y-0 w-16 flex items-center justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(1)}
                                    className="h-8 w-8 text-white/70 hover:text-white"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="pt-12 px-16 pb-16">
                                <img
                                    src={selectedImage.cloudflareUrl}
                                    alt={selectedImage.identifier}
                                    className="w-full h-full object-contain rounded"
                                    draggable={false}
                                />
                            </div>

                            <div className="absolute bottom-0 inset-x-0 flex items-center px-4 h-16 bg-background/5">
                                <div className="flex items-center gap-3">
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
                                            href={`/${selectedImage.user.name}/profile`}
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
                        </div>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}