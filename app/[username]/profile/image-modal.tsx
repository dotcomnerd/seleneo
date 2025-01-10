'use client';

import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Eye, X, Trash2, Globe, Lock } from 'lucide-react';
import { revalidatePath } from 'next/cache';

type ImageModalProps = {
    children: React.ReactNode;
    image: {
        id: string;
        cloudflareUrl: string;
        visibility: string;
        identifier: string;
        createdAt: string;
        updatedAt: string;
    };
    isOwner: boolean;
    name?: string;
};

export function ImageModal({ children, image, isOwner, name }: ImageModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!isOwner || name === "") return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/images?id=${image.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete image');
            }

            setIsOpen(false);

        } catch (error) {
            console.error('Error deleting image:', error);
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div onClick={() => setIsOpen(true)}>{children}</div>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="max-w-4xl">
                    <div className="absolute right-4 top-4 z-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg hidden">{image.identifier}</AlertDialogTitle>
                        <AlertDialogDescription className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                {/* <Eye className="h-4 w-4" /> */}
                                {/* Visibility: */}
                                {image.visibility === 'PUBLIC' ? (
                                    <span className="flex items-center gap-1 text-primary">
                                        <Globe className="h-3 w-3" /> Public
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <Lock className="h-3 w-3" /> Private
                                    </span>
                                )}
                            </span>
                            <span className="text-muted-foreground">
                                Created on {new Date(image.createdAt).toLocaleString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                })}
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-4">
                        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border">
                            <img
                                src={image.cloudflareUrl}
                                alt={image.identifier}
                                className="object-contain w-full h-full bg-background"
                            />
                        </AspectRatio>
                    </div>

                    <AlertDialogFooter className="flex sm:justify-start gap-2 mt-2">
                        {isOwner && (
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                {isDeleting ? 'Deleting...' : 'Delete Image'}
                            </Button>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}