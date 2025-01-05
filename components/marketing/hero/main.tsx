import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GithubIcon } from '../icons/github';
import { FadeIn } from './blur-fade';
import { HeroImage } from './image';
import { WordRotate } from './word-rotate';

export const Cover = ({
    words,
    className,
}: {
    words: string[];
    className?: string;
}) => {
    return (
        <div className="ml-2 inline-block translate-y-4">
            <motion.div
                className="relative inline-block px-2 py-0 rounded-sm"
                animate={{
                    scale: [1, 1.001, 0.999, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            >
                <motion.span
                    className={cn(
                        "inline-block relative z-20 italic",
                        className
                    )}
                >
                    <WordRotate duration={2000} className='w-max' words={words} />
                </motion.span>
                {/* dots */}
                <motion.div
                    className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-500 opacity-60"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0
                    }}
                />
                <motion.div
                    className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-blue-500 opacity-60"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                />
                <motion.div
                    className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-blue-500 opacity-60"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                <motion.div
                    className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-blue-500 opacity-60"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 1.5
                    }}
                />
                {/* border */}
                <div className="absolute inset-0 border border-blue-500 rounded-sm opacity-40" />
                {/* corners */}
                <motion.div
                    className="absolute inset-0 border-2 border-transparent"
                    animate={{
                        scaleX: [1, 1.004, 0.996, 1],
                        scaleY: [1, 0.996, 1.004, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                >
                    <div className="absolute left-0 top-0 w-2 h-2 border-l-2 border-t-2 border-blue-500 opacity-40" />
                    <div className="absolute right-0 top-0 w-2 h-2 border-r-2 border-t-2 border-blue-500 opacity-40" />
                    <div className="absolute left-0 bottom-0 w-2 h-2 border-l-2 border-b-2 border-blue-500 opacity-40" />
                    <div className="absolute right-0 bottom-0 w-2 h-2 border-r-2 border-b-2 border-blue-500 opacity-40" />
                </motion.div>
            </motion.div>
        </div>
    );
};


export function Hero() {

    return (
        <div className="relative container mx-auto px-4 pt-32 pb-40 text-center">
            <FadeIn delay={0}>
                <div className="flex justify-center mb-8">
                    <div
                        className={cn(
                            "group p-1 px-4 rounded-full border border-black/5 bg-indigo-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-indigo-200 dark:border-white/5 dark:bg-indigo-900/70 dark:hover:bg-indigo-900",
                        )}
                    >
                        <div className='flex flex-row justify-center items-center gap-2'>
                            <Link href="https://github.com/nyumat">
                                <GithubIcon />
                            </Link>
                            <p>Seleneo is launching soon...</p>
                        </div>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={200}>
                <div className="relative inline-block mb-6 max-w-3xl">
                    <h1 className="relative text-3xl md:text-5xl font-regular tracking-tighter">
                        The easiest way to make your product
                        <Cover words={["look incredible.", "convert users.", "feel amazing.", "turn more heads.", "land real clients."]} />
                    </h1>
                </div>
            </FadeIn>

            {/*TODO: maybe add in the future (figure out perf miss) <GradientBlobTwo/> */}

            <FadeIn delay={400}>
                <p className="md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    Create elegant showcases for all of your marketing needs in an instant—no design or figma skills needed. And of course, always 100% free.
                </p>
            </FadeIn>

            <FadeIn delay={600}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    className="group px-8 py-4 text-white rounded-lg font-semibold transition-all hover:cursor-not-allowed">
                                    <span className="flex items-center justify-center gap-2">
                                        Get Started
                                        <ArrowRight className="w-4 h-4 animate-pulse" />
                                    </span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Coming soon ;)
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={"stylish"}
                                    className="group px-8 py-4 rounded-lg font-semibold border border-indigo-200/50 dark:border-gray-700/50 hover:cursor-not-allowed">
                                    View Examples
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Making them now!
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </FadeIn>


            <FadeIn delay={800}>
                <div className="relative mx-auto max-w-5xl">
                    <HeroImage />
                </div>
            </FadeIn>
        </div>
    );
}