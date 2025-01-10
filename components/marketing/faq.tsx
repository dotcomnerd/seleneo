"use client"

import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus } from "lucide-react"
import { useState } from "react"

const faqs = [
    {
        question: "What exactly is Seleneo?",
        answer: `Seleneo is a design environment optimized for developers, content creators, marketers, and really, *anyone* who needs to generate visual assets without the overhead of enterprise design tools.

        It focuses on core functionality needed for creating assets like OG images, marketing materials, and content visuals, while minimizing interface complexity. Shoot, you can even make a logo with it!`,
    },
    {
        question: "How is Seleneo built?",
        answer: `Seleneo's architecture utilizes Next.js 14 as the core framework, with a component system built on shadcn/ui (providing a customizable implementation layer over Radix UI primitives).

        The image processing pipeline integrates html-to-image for DOM-to-canvas conversion, Jimp for programmatic image manipulation, and leverages the Canvas API for low-level pixel operations. For visual enhancement, we implement ColorThief and RGBaster for adaptive gradient generation through color extraction.

        Authentication is handled via NextAuth, while Prisma manages type-safe database operations with a Neon-hosted PostgreSQL instance. State management combines Zustand with Zundo for undo/redo functionality, complemented by Framer Motion for fluid animations.

        The application implements real-time interactions through react-moveable for manipulation and react-selecto for selection mechanics, with TipTap handling rich text editing.

        Our infrastructure design utilizes Cloudflare Images for blob storage and content delivery, while Sonner provides a toast notification system for real-time user feedback.

        The deployment pipeline is managed through Vercel's edge network, with DNS resolution handled via Spaceship, for this fantastic 'freedesign.fyi' domain.

        Devine and I had a ton of fun using all these tools and technologies to build Seleneo, so if you'd like to join us in the future, we'd love to have you!`,
    },
    {
        question: "Do I need to be a design expert to use Seleneo?",
        answer: `Nope! 🙅🏿‍♂️ ZERO prior design skills are required to use and enjoy Seleneo.

        I made sure that interface is structured around common development workflows, with drag-and-drop mechanics and real-time previews to make asset creation as intuitive as possible.`,
    },
    {
        question: "Why build another design tool?",
        answer: `Let's be honest with ourselves for a second.

        While Figma and Sketch excel at comprehensive design workflows, especially in an enterprise or startup environment, the other 90% of users need a more streamlined solution for crafting generalized assets.

        Seleneo addresses this by focusing *specifically* on rapid asset creation for every context.`,
    },
    {
        question: "Do you have any plans for ..... feature?",
        answer: `Our current roadmap was just to finish the project's MVP. As you see, we were able to do that : )

        In the future, we would love to include real-time collaboration through operational transformations, shared workspaces with role-based access control, version control, and SO much more.

        These features are planned for implementation after the initial ColorStack hackathon release.`,
    },
    {
        question: "What's with the name 'Seleneo'?",
        answer: `Nyuma is glad you asked : )

        Seleneo (seh-LEE-nee-oh) draws inspiration from Selene, the Greek goddess of the moon, symbolizing creativity, illumination, and guidance in the dark. The suffix '-neo' reflects innovation and modernity, perfectly capturing the spirit of the tool that we've built.

        As a design tool, Seleneo aims to provide clarity and direction in the often overwhelming world of visual asset creation.`,
    }
];

export function FAQ() {
    const [openItem, setOpenItem] = useState<string | null>("item-0")

    return (
        <section id="faq" className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col text-center rounded-md p-4 gap-3 items-center">
                    <div className="mb-4">
                        <Badge className='py-1 rounded-2xl px-4 text-lg bg-primary/70'>FAQ</Badge>
                    </div>
                    <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-center mb-4 m-auto">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                        Here are some of the most common questions we've received about Seleneo. If you have a question that isn't answered here, feel free to reach out to me (Nyuma) or Devine directly.
                    </p>
                </div>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full max-w-2xl mx-auto space-y-2"
                    value={openItem as string}
                    onValueChange={setOpenItem}
                >
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="bg-background px-4 py-1 border-t border-b-0 border-border"
                        >
                            <AccordionPrimitive.Header className="flex">
                                {/* TODO: investigate offset */}
                                <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between py-2 text-left text-[20px] tracking-tight font-regular transition-all duration-300 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-300 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180 translate-y-1">
                                    {faq.question}
                                    <Plus
                                        size={16}
                                        strokeWidth={2}
                                        className="shrink-0 opacity-60 transition-transform duration-300"
                                        aria-hidden="true"
                                    />
                                </AccordionPrimitive.Trigger>
                            </AccordionPrimitive.Header>
                            <AccordionContent className="py-2 text-muted-foreground whitespace-pre-line">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}