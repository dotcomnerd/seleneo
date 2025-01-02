"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? "bg-background/80 backdrop-blur-sm shadow-md" : ""}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">Seleneo</span>
                    </Link>
                    <nav className="hidden md:flex space-x-4">
                        <Link href="#features" className="text-sm font-medium hover:text-primary">Features</Link>
                        <Link href="#cta" className="text-sm font-medium hover:text-primary">Pricing</Link>
                        <Link href="#faq" className="text-sm font-medium hover:text-primary">FAQ</Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <Button asChild variant="outline">
                            <a href="https://github.com/yourusername/Seleneo" target="_blank" rel="noopener noreferrer">GitHub</a>
                        </Button>
                        <Button asChild>
                            <Link href="/studio">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
