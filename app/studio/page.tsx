import { StudioNavbar } from "@/components/navigation/studio";
import { Sidebar } from "@/components/sidebar";
import Spinner from "@/components/spinner/spinner";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
    generator: 'Next.js Baby!',
    applicationName: 'Seleneo',
    title: 'Studio - Seleneo',
    description: 'Welcome to Seleneo Studio, where all the magic happens.',
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
        title: 'Studio - Seleneo',
        description: 'Welcome to Seleneo Studio, where all the magic happens.',
        url: 'https://freedesign.fyi',
        siteName: 'Seleneo',
        images: [
            {
                url: 'https://freedesign.fyi/api/og?title=Studio',
                width: 1800,
                height: 1600,
                alt: 'Seleneo Studio',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
}

const Canvas = dynamic(() => import('@/components/studio/studio-main'), {
    ssr: false,
    loading: () =>
        <div className="flex-1 flex items-center justify-center h-full w-full">
            <Spinner />
        </div>
})

export default function StudioPage() {
    return (
        <div className="flex flex-col h-screen bg-background">
            <StudioNavbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    <Canvas />
                </div>
            </div>
        </div>
    )
}