import logo from "@/public/logo.svg";
import { AppWindow, FrameIcon, Github, Mail } from 'lucide-react';
import Link from "next/link";
import { Button } from '../ui/button';
import { FaFirefoxBrowser } from "react-icons/fa6";

const footerLinks = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'How it Works', href: '#how-it-works' },
            { label: 'FAQ', href: '#faq' },
        ]
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: 'mailto:tomenyuma@gmail.com' },
            { label: 'GitHub', href: 'https://github.com/nyumat' },
        ]
    }
];

export function Footer() {
    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 w-full">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={logo.src} className='size-6' />
                            <span className="font-bold text-xl">Seleneo</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            The one stop shop for digital product marketing.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/nyumat"
                                target="_blank"
                                title="GitHub"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://tomnyuma.rocks"
                                title="Website"
                                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                                <AppWindow className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            title={link.label}
                                            href={link.href}
                                            className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <p className='mt-4 font-light tracking-tight md:mt-0 text-gray-600 dark:text-gray-400'>Seleneo was built for the
                    <Button variant={"link"} className="-mx-3" asChild>
                        <Link target="_blank" href={"https://colorstack.notion.site/winter-break-hackathon-24"}>
                            ColorStack
                        </Link>
                    </Button>
                    Hackathon, by
                    <Button variant={"link"} className="-mx-3" asChild>
                        <Link target="_blank" href={"https://tomnyuma.rocks"}>
                            Nyumat
                        </Link>
                    </Button>
                </p>
            </div>
        </footer>
    );
}