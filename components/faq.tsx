"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

const faqs = [
    {
        question: "What is Seleneo?",
        answer: "Seleneo is a powerful design tool that allows you to create stunning visuals, layouts, and graphics with ease. It's perfect for entrepreneurs, marketers, and designers who want to create professional-looking content quickly.",
    },
    {
        question: "Do I need design experience to use Seleneo?",
        answer: "Not at all! Seleneo is designed to be user-friendly and intuitive, even for those with no prior design experience. We offer templates and easy-to-use tools to help you create beautiful designs.",
    },
    {
        question: "Can I use Seleneo for both web and print designs?",
        answer: "Yes, Seleneo is versatile and can be used for a wide range of design projects, including web graphics, social media posts, print materials, and more.",
    },
    {
        question: "Is there a free trial available?",
        answer: "Yes, we offer a 14-day free trial so you can explore all the features Seleneo has to offer before committing to a subscription.",
    },
    {
        question: "Can I collaborate with my team using Seleneo?",
        answer: "Seleneo offers collaboration features that allow you to work with your team members on design projects in real-time.",
    },
]

export function FAQ() {
    const [openItem, setOpenItem] = useState<string | null>("item-0")

    return (
        <section id="faq" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto" value={openItem} onValueChange={setOpenItem}>
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
