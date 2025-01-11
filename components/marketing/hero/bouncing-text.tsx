"use client";

import { useIsMobile } from '@/hooks/use-mobile';
import { motion, useAnimationControls } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

const getRandomColor = () => {
    const colors = [
        'bg-gradient-to-r from-fuchsia-500 to-pink-500 dark:from-fuchsia-700 dark:to-pink-700', // synthwave
        'bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800',   // green terminal
        'bg-gradient-to-r from-blue-500 to-teal-500 dark:from-blue-600 dark:to-teal-600',       // ocean
        'bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600'// sunset
    ];

    const bgToTextMap: Record<string, string> = {
        'bg-gradient-to-r from-fuchsia-500 to-pink-500 dark:from-fuchsia-700 dark:to-pink-700': 'text-white',
        'bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800': 'text-white',
        'bg-gradient-to-r from-blue-500 to-teal-500 dark:from-blue-600 dark:to-teal-600': 'text-white',
        'bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600': 'text-white'
    };

    const randomBgColor = colors[Math.floor(Math.random() * colors.length)];
    const randomTextColor = bgToTextMap[randomBgColor];

    return {
        background: randomBgColor,
        text: randomTextColor
    };
};

const getRandomVelocity = (currentVel: number) => {
    const multiplier = 0.7 + Math.random() * 0.6;
    return currentVel * multiplier;
};

interface BouncingTextProps {
    speed?: number;
    state: 'image' | 'bounce';
}

export function BouncingText({ speed = 0.2, state }: BouncingTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const controls = useAnimationControls();
    const [colors, setColors] = useState(getRandomColor());
    const animationRef = useRef<number>();
    const positionRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: speed, y: speed });
    const lastCollisionRef = useRef(0);
    const { resolvedTheme } = useTheme();
    const isMobile = useIsMobile();

    useEffect(() => {
        if (state === 'bounce') {
            positionRef.current = { x: 0, y: 0 };
            velocityRef.current = { x: speed, y: speed };
            controls.set({ x: 0, y: 0 });
            const initialPosition = () => {
                if (!containerRef.current || !textRef.current) return;
                const container = containerRef.current.getBoundingClientRect();
                const text = textRef.current.getBoundingClientRect();
                return {
                    x: Math.random() * (container.width - text.width),
                    y: Math.random() * (container.height - text.height)
                };
            };
            const startPos = initialPosition();
            if (startPos) {
                positionRef.current = startPos;
                controls.set(startPos);
            }
            setColors(getRandomColor());
        }
    }, [state, speed, controls]);

    useEffect(() => {
        if (!containerRef.current || !textRef.current || state !== 'bounce') {
            return;
        }

        let bounds = { width: 0, height: 0 };
        let textSize = { width: 0, height: 0 };

        const updateBounds = () => {
            if (containerRef.current && textRef.current) {
                const containerBounds = containerRef.current.getBoundingClientRect();
                const textBounds = textRef.current.getBoundingClientRect();
                bounds = {
                    width: containerBounds.width,
                    height: containerBounds.height
                };
                textSize = {
                    width: textBounds.width,
                    height: textBounds.height
                };

                // adjust position if out of bounds after resize
                positionRef.current.x = Math.min(positionRef.current.x, bounds.width - textSize.width);
                positionRef.current.y = Math.min(positionRef.current.y, bounds.height - textSize.height);
            }
        };

        const handleCollision = () => {
            const now = Date.now();
            if (now - lastCollisionRef.current > 50) {
                setColors(getRandomColor());
                velocityRef.current.x = getRandomVelocity(velocityRef.current.x);
                velocityRef.current.y = getRandomVelocity(velocityRef.current.y);
                lastCollisionRef.current = now;
            }
        };

        const animate = () => {
            if (!bounds.width || !bounds.height) {
                updateBounds();
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            positionRef.current.x += velocityRef.current.x;
            positionRef.current.y += velocityRef.current.y;

            const hitVertical = positionRef.current.x <= 0 || positionRef.current.x >= bounds.width - textSize.width;
            const hitHorizontal = positionRef.current.y <= 0 || positionRef.current.y >= bounds.height - textSize.height;

            if (hitVertical) {
                velocityRef.current.x *= -1;
                positionRef.current.x = Math.max(0, Math.min(positionRef.current.x, bounds.width - textSize.width));
                handleCollision();
            }
            if (hitHorizontal) {
                velocityRef.current.y *= -1;
                positionRef.current.y = Math.max(0, Math.min(positionRef.current.y, bounds.height - textSize.height));
                handleCollision();
            }

            controls.set({
                x: positionRef.current.x,
                y: positionRef.current.y
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        updateBounds();

        const resizeObserver = new ResizeObserver(updateBounds);
        resizeObserver.observe(containerRef.current);

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            resizeObserver.disconnect();
        };
    }, [state, speed, controls]);

    return (
        <div ref={containerRef} className="absolute inset-0">
            {state === 'image' && (
                <img
                    src={typeof window !== 'undefined' && typeof document !== 'undefined' &&
                        resolvedTheme === "light" ? "/studio-demo-light.webp" : "/studio-demo.webp"}
                    alt="studio demo"
                    className={`object-cover h-full ${resolvedTheme === "dark" ? 'w-full' : 'w-[150%]'}`}
                />
            )}
            {state === 'bounce' && (
                <motion.div
                    ref={textRef}
                    animate={controls}
                    initial={{ x: 0, y: 0 }}
                    className={`absolute flex items-center w-auto max-w-full break-words
                        ${!isMobile && colors.background}
                        backdrop-blur-sm md:px-4 py-2 rounded-lg transition-colors duration-200 bg-opacity-80`}
                >
                    <span className={`${colors.text} transition-colors duration-200`}>
                        {isMobile ?
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" alt="notion logo" className="w-6 h-6 inline-block" />
                            :
                            <p className="inline-block">you found the easter egg! 🥚</p>
                        }
                    </span>
                </motion.div>
            )}
        </div>
    );
}