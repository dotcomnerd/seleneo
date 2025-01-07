import { StudioNavbar } from "@/components/navigation/studio"
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowRight } from "lucide-react"
import { Metadata } from "next"
import Link from 'next/link'
import { ProjectShowcase } from "./showcase"

export const metadata: Metadata = {
    generator: 'Next.js Baby!',
    applicationName: 'Seleneo',
    title: 'About - Seleneo',
    description: 'Learn more about Seleneo, the free design tooling built for humans.',
    robots: 'index, follow',
    referrer: 'origin-when-cross-origin',
    keywords: ['design', 'tooling', 'open-source', 'digital assets', 'social media', 'images',
        'thumbnails', 'screenshots', 'free design tooling', 'seleneo', 'seleneo design tooling',
        'graphics', 'editing', 'creative', 'visual', 'marketing', 'branding', 'digital tools',
        'image editor', 'social media tools', 'content creation', 'web design', 'UI/UX', 'thumbnail generator',
        'design software', 'media creation', 'asset management', 'social graphics', 'visual content',
        'design platform', 'digital marketing', 'image optimization', 'design resources', 'content tools',
        'digital design', 'online editor', 'web tools', 'creative suite', 'design automation',
        'social assets', 'media toolkit'],
    authors: [{ name: 'Nyumat', url: 'https://github.com/nyumat' }],
    creator: 'Nyumat',
    publisher: 'Nyumat',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://freedesign.fyi'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'About - Seleneo',
        description: 'Learn more about Seleneo, the free design tooling built for humans.',
        url: 'https://freedesign.fyi',
        siteName: 'Seleneo',
        images: [
            {
                url: 'https://freedesign.fyi/api/og?title=About',
                width: 1800,
                height: 1600,
                alt: 'Seleneo Open Graph Image',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
}


export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <StudioNavbar />
            <main className="container mx-auto px-4 py-10 md:py-16 md:px-6 lg:px-8">
                <article className="prose prose-gray dark:prose-invert mx-auto max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-normal tracking-tighter mb-8">
                        About Seleneo
                    </h1>

                    <p className="text-base font-light leading-relaxed mb-8">
                        Seleneo was born during the ColorStack Winter Break Hackathon. Originally,
                        I was on a different team working on software for university clubs,
                        but when the holidays and life got in the way, I decided to pivot and go solo. <br /><br />
                        During my ideation, I realized something. Figma and Sketch are great tools, but they're
                        often overkill for simple tasks.
                        <br /><br />
                        I wanted to build a tool that stripped away the
                        complexity while maintaining the power to create beautiful visuals, especially for
                        me, a developer building websites, crafting marketing pages, and creating blog content.
                    </p>

                    <h2 className="text-2xl font-normal tracking-tighter mt-12 mb-4">
                        Why Build Another Design Tool?
                    </h2>

                    <p className="text-base font-light leading-relaxed mb-8">
                        As a developer, I spend a lot of time doing things that aren't writing code. Building landing pages, crafting marketing materials, and creating blog content are all part of the job. <br /><br />
                        Each piece of content calls for visuals that enhance the user experience and effectively communicate ideas.
                        Traditionally, we'd turn to tools like Figma or Sketch, but these professional-grade tools often bring
                        unnecessary complexity for simple tasks.
                    </p>

                    <p className="text-base font-light leading-relaxed mb-8">
                        Want to create a custom open graph image for your website? You're suddenly dealing with account creation,
                        professional subscriptions, and navigating a steep learning curve just to create a simple visual. I wasn't
                        an expert at these tools either, so I decided to build something different.
                    </p>

                    <h2 className="text-2xl font-normal tracking-tighter mt-12 mb-4">
                        The Solution
                    </h2>

                    <p className="text-base font-light leading-relaxed mb-8">
                        Seleneo strips away the complexity while maintaining the power to create beautiful visuals. It's built
                        with modern web technologies like Next.js, React, and Tailwind CSS, focusing on providing an intuitive
                        interface that doesn't sacrifice capability for simplicity.
                    </p>

                    <h2 className="text-2xl font-normal tracking-tighter mt-12 mb-4">
                        Looking Forward
                    </h2>

                    <p className="text-base font-light leading-relaxed mb-8">
                        While Seleneo started as a hackathon project, my vision extends far beyond. The roadmap includes features
                        like team collaboration, template sharing, and integration with popular development workflows. The goal is
                        to create a community-driven platform where developers can share their designs and inspire others.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        className="group px-8 py-4 text-white rounded-lg font-semibold transition-all hover:cursor-not-allowed">
                                        <span className="flex items-center justify-center gap-2">
                                            Try the Alpha Version
                                            <ArrowRight className="w-4 h-4 animate-pulse" />
                                        </span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Coming soon ;)
                                </TooltipContent>
                            </Tooltip>
                            <Button asChild variant="outline">
                                <Link href="https://github.com/dotcomnerd/seleneo" target="_blank" rel="noopener noreferrer">
                                    View on GitHub
                                </Link>
                            </Button>
                        </TooltipProvider>
                    </div>
                    <ProjectShowcase />
                </article>
            </main>
        </div>
    )
}