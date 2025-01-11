import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, InfoIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { GitHubButton } from '../icons/github';
import { FadeIn } from './blur-fade';
import { WordRotate } from './word-rotate';

// TODO: reconsider this?
const HeroImage = dynamic(() => import('@/components/marketing/hero/image'), {
    ssr: false
})

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
                    <WordRotate duration={3000} className='w-max' words={words} />
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
                    <GitHubButton />
                </div>
            </FadeIn>
            <FadeIn delay={200}>
                <div className="relative inline-block mb-6 max-w-3xl">
                    <h1 className="relative text-3xl md:text-5xl font-regular tracking-tighter">
                        The easiest way to make your product
                        <Cover words={[
                            "turn more heads.",
                            "look incredible.",
                            "feel amazing.",
                            "convert users.",
                            "land real clients.",
                        ]} />
                    </h1>
                </div>
            </FadeIn>
            {/* TODO: maybe add in the future (figure out perf miss) */}
            {/* <GradientBlobTwo /> */}
            <FadeIn delay={400}>
                <p className="md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                    Create elegant showcases for all of your marketing needs in an instant—no design or figma skills needed. And of course, always 100% free.
                </p>
            </FadeIn>
            <FadeIn delay={600}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <Button
                        className="group px-8 py-4 text-white rounded-lg font-semibold transition-all" asChild>
                        <Link href="/studio" prefetch={null} title='Go to Studio'>
                            <span className="flex items-center justify-center gap-2">
                                Get Started
                                <ArrowRight className="w-4 h-4 animate-pulse" />
                            </span>
                        </Link>
                    </Button>
                    <Button variant={"stylish"} className="group px-8 py-4 rounded-lg font-semibold border border-indigo-200/50 dark:border-gray-700/50 dark:hover:bg-primary/10 hover:bg-primary/10" asChild>
                        <Link href="/about" title='Learn More About Seleneo' prefetch={null}>
                            <div className="flex items-center justify-center gap-2">
                                <InfoIcon className="size-4" />
                                Learn More
                            </div>
                        </Link>
                    </Button>
                </div>
                <Button
                    variant={"link"}
                    className="font-semibold" asChild>
                    <Link href="/community" prefetch={null}>
                        Explore Community Gallery
                    </Link>
                </Button>
            </FadeIn>
            <FadeIn delay={800}>
                <div className="relative mx-auto max-w-5xl">
                    <HeroImage />
                </div>
            </FadeIn>
        </div>
    );
}