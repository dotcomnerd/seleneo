"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"
import { Badge } from "../ui/badge"

const faqs = [
    {
        question: "What is Seleneo?",
        answer: "Some might call Seleneo a just a design tool, but we like to think of it as more than that. Seleneo is a tool kit that allows you to develop visuals, layouts, and graphics for any type of use case. It's perfect for entrepreneurs, marketers, designers, and even web developers who want to create professional-looking content super quickly.",
    },
    {
        question: "Do I need design experience to use Seleneo?",
        answer: "Not at all! I designed Seleneo to be extremely user-friendly and intuitive, even for design noobies. I plan to add templates and examples if you need a more solid reference.",
    },
    {
        question: "Why did you make this?",
        answer:
            `Initially, I made Seleneo for people just like me. As developers, some of us build websites, marketing pages, and even write blog content.
            In that content, graphic visuals are used to get across ideas and provide another layer of content for the reader/ viewer.
            Traditionally, designers and developers would use something like Figma or Apple's Sketch to create these visuals.
            However, with figma, you take on a slew of nuance, that for the average indie developer, is often times, too much.
            For example, let's say you're a web developer looking to make a custom open graph for your websitee content.
            You need—yet another "account"—a professsional plan to access the next-level features—and skills in proprietary software that takes a steep learning curve to master.
            I wasn't an expert at the tool, so for the ColorStack hackathon, I decided to build one to ensure people just like me—never have to face the same problem again.`,
    },
    {
        question: "Can I collaborate with my team using Seleneo?",
        answer: "I have a huge laundry list of capabilities I'd love to add to Seleneo. I plan on adding these features (including this one) to Seleneo after (—or during, if I have time) the ColorStack hackathon. These will all be super fun to build! Maybe, just maybe, I can onboard new collaborators to help ensure Seleneo's posterity.",
    },
]

export function FAQ() {
    const [openItem, setOpenItem] = useState<string | null>("item-0")

    return (
        <section id="faq" className="py-16 my-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col text-center rounded-md p-4 gap-3 items-center">
                    <div className="mb-4">
                        <Badge className='py-1 rounded-2xl px-4 text-lg bg-primary/70'>FAQ</Badge>
                    </div>
                    <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-center mb-4 m-auto">Frequently Asked Questions</h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Here are some of the most common questions I've received about Seleneo. If you have a question that isn't answered here, feel free to reach out to me directly.</p>
                    </div>
                <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto" value={openItem as string} onValueChange={setOpenItem}>
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
