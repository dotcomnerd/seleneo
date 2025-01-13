import { Footer } from "@/components/marketing/footer"
import { StudioNavbar } from "@/components/navigation/studio"
import { Button } from '@/components/ui/button'
import { ArrowRight, Info } from "lucide-react"
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
                    <h1 className="text-3xl md:text-4xl font-normal tracking-tighter mb-6">
                        About Seleneo
                    </h1>
                    <div className="flex flex-col border-l-4 border-primary pl-4 py-2">
                        <div className="flex flex-row gap-2 pb-2 justify-start items-center">
                            <Info className="text-primary/80 size-5" />
                            <p>Note</p>
                        </div>
                        <p className="text-sm tracking-wide leading-6 ml-6">The name "Seleneo" (seh-LEE-nee-oh) draws inspiration from Selene, the Greek goddess of the moon, symbolizing creativity, illumination, and guidance in the dark. The suffix '-neo' reflects innovation and modernity, capturing the spirit of the application.</p>
                    </div>
                    <br />
                    <p className="text-base font-light leading-relaxed mb-8">
                        Quick story. Last year—amidst my internship at Notion, <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" className="size-6 inline-block px-1 mr-1" />
                        One of my <Link href="https://www.linkedin.com/posts/notionhq_its-easier-than-ever-to-secure-your-account-activity-7242602102907117568-0jm7"
                            className="text-primary hover:underline" target="_blank">intern projects</Link> required heavy iterations in Figma,
                        and being a <i>developer-first</i>, I found the tool overwhelming. This soon led to my comment:
                        <br /><br />
                        <img src="/we-need-seleneo.png" className="w-full rounded-md" />
                        <br />
                        Since I started doing product development, I've always craved something that was easy to use. The big players feel like they all require 3 YouTube tutorials, 2 Medium articles, and a StackOverflow thread, <i>just</i> to get started.<br /> <br />For <i>the large majority</i> of my use cases, a tool that's:
                        simple, fast, and powerful—is all I desired. <br /><br />  I put the idea on the back burner, thinking it was just a pipe dream.
                        Even when the ColorStack hackathon was surprisingly announced, there was still, no ounce of courage inside of me.
                        <br /><br />
                        Especially because, let's be real. All of these tools (Figma, Excalidraw, Sketch, to name a few) are complex for a reason. They're built for professionals, scale to millions of users, and boast little to no downtime.
                        <br /><br />
                        However...when thinking deeper—the 💡 hit. To me, it was never about building a tool that's as complex as they all are. I can't do that for a hackathon. I really can't. However, I can build something for people just like me and you. Yeah, maybe not as complex, but, it can still uphold the core ability to create
                        neat presentations for any context.
                        <br /><br />
                        Although it was weeks into the ColorStack hackathon, and I've already spent hours working on another team. I knew myself—without motivation, it's hard to stay committed to buid *anything*. Therefore, I decided to take on the challenge of building out Seleneo.
                        <br /><br />

                        At the core, I wanted a tool that stripped away the complexity while maintaining the power to create beautiful visuals, especially for
                        me—<i>customer 0</i>—a developer building websites, YouTube thumbnails, and even creating blog content. Ubiquity was the goal, but I wondered:
                        How can I support all the various workflows users may have? <br />
                    </p>

                    <h2 className="text-2xl font-normal tracking-tighter mt-12 mb-4">
                        So...Why Build Another Design Tool?
                    </h2>

                    <p className="text-base font-light leading-relaxed mb-8">
                        As a tried and true builder, I spend a lot of time doing things that aren't writing code.
                        Whether it's designing a website, creating social previews for my applications, or recording a YouTube video demonstration.
                        <br /><br />
                        Each piece of content calls for visuals that entice the user to engage and in some cases, effectively communicate ideas.
                        Traditionally, we'd turn to tools like Photoshop, Figma, or Sketch, but these professional-grade tools often bring
                        unnecessary complexity for simple tasks, especially for developers who aren't designers, and humans who aren't power users.
                    </p>

                    <p className="text-base font-light leading-relaxed mb-8">
                        For instance. Want to create a custom open graph image for your website? You're suddenly dealing with an overwhelming interface,
                        subscription plans, and navigating a steep learning curve just to create a simple visual. <br /><br />I wasn't
                        an power user of these tools either, which is how the idea for Seleneo was born. The goal was simple: to create a tool that
                        would make it easy for <span className="italic inline-block">anyone</span> to create beautiful visuals quickly and easily.
                    </p>

                    <h2 className="text-2xl font-normal tracking-tighter mt-12 mb-4">
                        The Solution
                    </h2>

                    <p className="text-base font-light leading-relaxed mb-8">
                        Seleneo strips away the complexity of existing tools, while maintaining the power to craft elegant visuals.
                        Built with developers and creators in mind, Seleneo is a free (literally & figuratively) design canvas that's easy to use, blazing-fast, and honestly, very powerful.
                        <br /><br />

                        Initially working alone, I got the entire frontend done in about 5 days. However, I soon realized that I needed help with the backend. The last thing on my mind after writing thousands of lines of CSS was API routes. That was already a headache. I needed help.
                        <br /><br />
                        So, I decided to bring on the team my friend, 'cracked' backend developer, fellow ColorStack member, and incoming software engineer at Oracle, <Link className="text-primary hover:underline" href="https://github.com/Flanderzz" target="_blank">Devine</Link>
                        —who was more than happy to help. We got an MVP for the backend done in about 3 days, and the rest is history. <br /><br />

                        I don't know if it's just me, but isn't it just hilarious how, a simple comment led to this winter break hackathon project, which led to a full-fledged design tool? Life sure is funny.
                    </p>

                    <h2 className="text-2xl font-normal tracking-tighter mt-12 mb-4">
                        Looking Forward
                    </h2>

                    <p className="text-base font-light leading-relaxed mb-8">
                        While Seleneo started as a hackathon project, our vision for this project extends far beyond the ColorStack Hackathon. Devine and I truly feel like this project
                        could become something massive, and we're excited to see where it goes from here. <br /><br />

                        Our roadmap includes features like real-time team collaboration and spaces, more sharing options, and an auto-save capability similar to Google Docs.
                        If ColorStack is able to pay for our infrastructure, we'll be able to keep this tool free for everyone. And keep the domain <span className="text-primary">freedesign.fyi</span> alive—literally and figuratively.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                        <Button
                            className="group px-8 py-4 text-white rounded-lg font-semibold transition-all" variant={"default"} asChild>
                            <span className="inline-flex items-center gap-2">
                                <Link href="/studio">
                                    Try Seleneo Now
                                </Link>
                                <ArrowRight className="w-4 h-4 animate-pulse" />
                            </span>
                        </Button>

                        <Button asChild variant="outline">
                            <Link href="https://github.com/dotcomnerd/seleneo" target="_blank" rel="noopener noreferrer">
                                View on GitHub
                            </Link>
                        </Button>
                    </div>
                    <ProjectShowcase />
                </article>
            </main>
            <Footer />
        </div>
    )
}