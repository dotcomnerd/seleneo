"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { AnimatedGridPattern } from "./grid-pattern";
import { FadeIn } from "./hero/blur-fade";
import { SparklesCore } from "./sparkles";

export function CallToAction() {
    const { resolvedTheme } = useTheme();
    return (
        <>
            <div className="relative w-full">
                <div className="w-full py-20 lg:py-32 my-32">
                    <div className="container mx-auto">
                        <div className="flex flex-col text-center rounded-md p-4 lg:p-14 gap-8 items-center">
                            <div>
                                <Badge className='py-1 rounded-2xl px-4 text-lg bg-primary/70'>Use Seleneo</Badge>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                                    What are you waiting for?
                                </h3>
                                <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
                                    Just kidding—Seleneo is still being developed by <Button variant={"link"} className="-mx-4 text-lg" asChild>
                                        <Link target="_blank" href={"https://tomnyuma.rocks"}>
                                            Nyumat
                                        </Link>
                                    </Button>. <br />Check back later, I'm launching the platform soon!
                                </p>
                            </div>
                            <div className="flex flex-row gap-4">
                                <div className="w-full bg-background flex flex-col items-center justify-center overflow-hidden rounded-md">
                                    <h3 className="text-xl md:text-2xl tracking-tighter max-w-xl font-regular whitespace-nowrap">
                                        Seleneo is Coming Soon.
                                    </h3>
                                    <div className="w-[40rem] h-40 relative">
                                        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                                        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                                        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                                        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
                                        <SparklesCore
                                            background="transparent"
                                            minSize={0.4}
                                            maxSize={1}
                                            particleDensity={200}
                                            className="w-full h-full"
                                            particleColor={resolvedTheme === 'dark' ? '#fff' : '#2218de'}
                                        />
                                        {/* prevent weird ass edges */}
                                        <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AnimatedGridPattern
                    numSquares={10}
                    maxOpacity={0.5}
                    duration={1}
                    repeatDelay={1}
                    className={cn(
                        "-translate-y-40",
                        "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
                    )}
                />
    </div>
        </>
    );
}