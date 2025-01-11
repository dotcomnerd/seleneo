"use client"

import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { useLayoutEffect, useState } from 'react';

const bodyVariants = {
    normal: {
        opacity: 1,
        pathLength: 1,
        scale: 1,
        transition: {
            duration: 0.3,
        },
    },
    animate: {
        opacity: [0, 1],
        pathLength: [0, 1],
        scale: [0.9, 1],
        transition: {
            duration: 0.4,
        },
    },
};

const tailVariants = {
    normal: {
        pathLength: 1,
        rotate: 0,
        transition: {
            duration: 0.3,
        },
    },
    draw: {
        pathLength: [0, 1],
        rotate: 0,
        transition: {
            duration: 0.5,
        },
    },
    wag: {
        pathLength: 1,
        rotate: [0, -15, 15, -10, 10, -5, 5],
        transition: {
            duration: 2.5,
            ease: 'easeInOut',
            repeat: Infinity,
        },
    },
};

const GithubIcon = ({ isHovered }: { isHovered: boolean }) => {
    const bodyControls = useAnimation();
    const tailControls = useAnimation();

    useLayoutEffect(() => {
        if (isHovered) {
            bodyControls.start('animate');
            const animateTail = async () => {
                await tailControls.start('draw');
                tailControls.start('wag');
            };
            animateTail();
        } else {
            bodyControls.start('normal');
            tailControls.start('normal');
        }
    }, [isHovered, bodyControls, tailControls]);

    return (
        <div className="flex items-center justify-center size-4">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <motion.path
                    variants={bodyVariants}
                    initial="normal"
                    animate={bodyControls}
                    d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
                />
                <motion.path
                    variants={tailVariants}
                    initial="normal"
                    animate={tailControls}
                    d="M9 18c-4.51 2-5-2-7-2"
                />
            </svg>
        </div>
    );
};

export const GitHubButton = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group p-1 px-4 rounded-full border border-black/5 bg-blue-100 text-base dark:text-white transition-all ease-in hover:cursor-pointer hover:bg-blue-200 dark:border-white/5 dark:bg-blue-900/70 dark:hover:bg-blue-900"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-row justify-center items-center gap-2">
                <Link
                    href="https://github.com/dotcomnerd/seleneo"
                    title="Seleneo on GitHub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                >
                    <GithubIcon isHovered={isHovered} />
                    <span className="group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-blue-700 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent dark:group-hover:from-blue-300 dark:group-hover:via-blue-200 dark:group-hover:to-blue-300">
                        Star Seleneo on GitHub
                    </span>
                </Link>
            </div>
        </div>
    );
};
