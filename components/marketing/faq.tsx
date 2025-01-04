"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

const faqs = [
    {
        question: "What is Seleneo?",
        answer: "Some might call Seleneo a just a design tool, but we like to think of it as more than that. Seleneo is a tool kit that allows you to develop amazing visuals, layouts, and graphics for any type of use case. It's perfect for entrepreneurs, marketers, designers, and even web developers who want to create professional-looking content super quickly.",
    },
    {
        question: "Do I need design experience to use Seleneo?",
        answer: "Not at all! I designed Seleneo to be extremely user-friendly and intuitive, even for design noobies. We offer background templates and examples if you need a more solid reference.",
    },
    {
        question: "Can I use Seleneo for both web and print designs?",
        answer: "Yes, Seleneo is versatile and can be used for a wide range of design projects, including web graphics, social media posts, print materials, and more.",
    },
    {
        question: "Why did you make this?",
        answer: "I made Seleneo because when building content for my websites, blogs, and marketing, it's always been hard to get the designs EXACTLY how I want them, especially when not trying to use Figma. I wasn't an expert at the tool, so I decided to build one to help people like me, not have to face the same problem again. When the ColorStack hackathon came around, it was only right."
    },
    {
        question: "Can I collaborate with my team using Seleneo?",
        answer: "I'm planning on adding thesse capabilities to Seleneo after (or during, if I have time) the ColorStack hackathon. This will be super fun to build!",
    },
]

export function FAQ() {
    const [openItem, setOpenItem] = useState<string | null>("item-0")

    return (
        <section id="faq" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-center mb-12 m-auto">Frequently Asked Questions</h2>
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
