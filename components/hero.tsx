"use client"

import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { useRef } from "react"

export function Hero() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const containerVariants = {
        hidden: {
            opacity: 0,
            filter: "blur(10px)",
            y: 50
        },
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(5px)"
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <motion.div
                ref={ref}
                className="relative z-10 text-center"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6"
                    variants={itemVariants}
                >
                    Welcome to <span className="text-primary">Seleneo</span>
                </motion.h1>

                <motion.p
                    className="text-xl sm:text-2xl md:text-3xl mb-8 max-w-2xl mx-auto"
                    variants={itemVariants}
                >
                    Create stunning visuals with ease. Perfect for entrepreneurs and designers alike.
                </motion.p>

                <motion.div
                    className="flex justify-center space-x-4"
                    variants={itemVariants}
                >
                    <Button asChild size="lg">
                        <Link href="/studio">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="#features">Learn More</Link>
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    )
}