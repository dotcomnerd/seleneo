"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import Link from "next/link";
import { Github, Globe, X } from 'lucide-react';

const projects = [
    {
        title: "Muse",
        description: "A free music streaming service that lets you listen to your favorite songs and create playlists.",
        image: "https://www.freedesign.fyi/twitter.png",
        productImage: "https://www.freedesign.fyi/demo.png",
        product: "http://museisfun.fly.dev/",
        github: "https://github.com/nyumat/muse",
    },
    {
        title: "NyumatFlix",
        description: "A next-generation of streaming service that lets you watch your favorite movies and TV shows...for free.",
        image: "https://nyumatflix.com/preview.png",
        productImage: "https://freedesign.fyi/nyumatflix-preview.webp",
        product: "https://nyumatflix.com",
        github: "https://github.com/nyumat/nyumatflix",
    },
    {
        title: "Incivent",
        description: "A real-time incident tracking map for communities around the world.",
        image: "https://dont-commit-crimes.vercel.app/og-image.png",
        product: "https://dont-commit-crimes.vercel.app",
        productImage: "https://dont-commit-crimes.vercel.app/preview.png",
        github: "https://github.com/nyumat/incivent",
    },
    {
        title: "DubJam",
        description: "A collaborative music creation platform that lets you create beats and melodies with friends, in real-time.",
        image: "https://dubjam.onrender.com/meta.png",
        productImage: "https://freedesign.fyi/dubjam.webp",
        product: "https://dubjam.onrender.com",
        github: "https://github.com/Nyumat/dubhacks",
    },
];

export function ProjectShowcase() {
    const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);

    return (
        <section className="mt-16 mb-8">
            <h2 className="text-2xl font-normal tracking-tighter mb-6">Other Projects by <Link className="text-primary hover:underline" href="https://github.com/nyumat">Nyumat</Link></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="cursor-pointer group relative overflow-hidden rounded-lg border bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setSelectedProject(project)}
                    >
                        <AspectRatio ratio={16 / 9}>
                            <img
                                src={project.image}
                                alt={project.title}
                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                        </AspectRatio>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-white font-semibold">{project.title}</h3>
                                <p className="text-white/80 text-sm">Click to learn more</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AlertDialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
                <AlertDialogContent className="max-w-3xl">
                    <div className="absolute right-4 top-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedProject(null)}
                            className="hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl">{selectedProject?.title}</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                            {selectedProject?.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-4">
                        <AspectRatio ratio={16/9} className="overflow-hidden rounded-lg border">
                            <img
                                src={selectedProject?.productImage}
                                alt={`${selectedProject?.title} Preview`}
                                className="object-cover w-full h-full"
                            />
                        </AspectRatio>
                    </div>

                    <AlertDialogFooter className="flex sm:justify-start gap-2 mt-2">
                        <Button variant="default" asChild>
                            <Link href={selectedProject?.github || ''} target="_blank" rel="noopener noreferrer" className="gap-2">
                                <Github className="h-4 w-4" />
                                GitHub
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={selectedProject?.product || ''} target="_blank" rel="noopener noreferrer" className="gap-2">
                                <Globe className="h-4 w-4" />
                                Visit Site
                            </Link>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    );
}