import { Footer } from "@/components/marketing/footer"
import { StudioNavbar } from "@/components/navigation/studio"
import { Button } from '@/components/ui/button'
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
                        Quick story. Last year—amidst my internship at Notion, <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" className="size-6 inline-block px-1 mr-1" />
                        The idea for Seleneo was born in one of our design channels. My intern project required heavy iterations in Figma,
                        and being a <i>developer-first</i>, I found the tool overwhelming. This soon led to my comment:
                        <br /><br />
                        <img src="/we-need-seleneo.png" className="w-full rounded-md" />
                        <br />
                        I didn't realize it at the time, but the validation from this comment would lead to the creation of Seleneo.{" "}
                        <span className="text-primary">A design tool built for humans.</span>
                        <br /><br />
                        Once the ColorStack hackathon came around, I didn't think I could do it. So, I joined a team building software for university clubs.
                        Unforunately for us, when the holidays and life got in the way—our team gave up. I soon knew. <span className="text-primary italic">"This is my moment"</span>{" "},
                        therefore, I decided to pivot and take on this journey to build this product. <br /><br />

                        I wanted a tool that stripped away the complexity while maintaining the power to create beautiful visuals, especially for
                        me—<i>customer 0</i>—a developer building websites, YouTube thumbnails, and even creating blog content. Ubiquity was the goal.
                        How can I support all the various workflows our users may have? <br /><br /> <span className="text-primary">And that's how Seleneo was born.</span>
                    </p>

                    <h2 className="text-2xl font-normal tracking-tighter mt-12 mb-4">
                        So Why Build Another Design Tool?
                    </h2>

                    <p className="text-base font-light leading-relaxed mb-8">
                        As a tried and true builder, I spend a lot of time doing things that aren't writing code.
                        Building landing pages, crafting marketing materials like YouTube thumbnails, and creating blog content are all part of the job.
                        <br /><br />
                        Each piece of content calls for visuals that enhance the user experience and effectively communicate ideas.
                        Traditionally, we'd turn to tools like Figma or Sketch, but these professional-grade tools often bring
                        unnecessary complexity for simple tasks, especially for developers who aren't designers, and humans who aren't power users.
                    </p>

                    <p className="text-base font-light leading-relaxed mb-8">
                        For instance. Want to create a custom open graph image for your website? You're suddenly dealing with an overwhelming interface,
                        subscription plans, and navigating a steep learning curve just to create a simple visual. <br /><br />I wasn't
                        an power user of these tools either, so for this hackathon, I decided to take on the challenge of building a tool that
                        would make it easy for <span className="text-primary inline-block">anyone</span> to create beautiful visuals.
                    </p>

                    <h2 className="text-2xl font-normal tracking-tighter mt-12 mb-4">
                        The Solution
                    </h2>

                    <p className="text-base font-light leading-relaxed mb-8">
                        Seleneo strips away the complexity while maintaining the power to create beautiful visuals.
                        Built with developers and creators in mind, Seleneo is a design tool that's easy to use, fast, and powerful.
                        <br /><br />

                        Initially working alone, I got the entire frontend done in about 5 days. However, I soon realized that I needed help with the backend.
                        I decided to bring on the team my friend, 'cracked' backend developer, and software engineer at Oracle, <Link className="text-primary hover:underline" href="https://github.com/Flanderzz" target="_blank">Devine</Link>
                        —who was more than happy to help. We got the backend done in about 3 days, and the rest was history. <br /><br />


                        With Seleneo, you can create stunning visuals for your website, social media, and more in minutes.
                        The design studio makes it easy to create custom graphics, thumbnails, and images for your projects, and explore a library of community-generated content.
                        <br /><br />
                        With features like adaptive gradient background generation, 100+ image customization options, and cloud-saving,
                        Seleneo is the perfect tool for <s>developers, designers, and creators</s> <span className="text-primary inline-block">everyone</span> looking to develop meaningful content quickly and easily. <br /><br />

                        Isn't it just funny how, a simple comment in a design channel led to the creation of a tool that would change the way we create visuals?
                    </p>

                    <h2 className="text-2xl font-normal tracking-tighter mt-12 mb-4">
                        Looking Forward
                    </h2>

                    <p className="text-base font-light leading-relaxed mb-8">
                        While Seleneo started as a hackathon project, our vision for this project extends far beyond the ColorStack Hackathon. Devine and I truly feel like this project
                        could become something massive, and we're excited to see where it goes from here. <br /><br />

                        Our roadmap includes features like real-time team collaboration and spaces, more sharing options, and an auto-save capbilitiy similar to Google Docs.
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