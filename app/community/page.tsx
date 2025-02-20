import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ImageGallery } from "./image-gallery";
import { headers } from 'next/headers';
import { Button } from '@/components/ui/button';
import Link from "next/link";
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    generator: 'Next.js Baby!',
    applicationName: 'Seleneo',
    title: 'Community Showcase - Seleneo',
    description: 'Explore the community-made designs and images, as shared by our users.',
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
        title: 'Community Showcase - Seleneo',
        description: 'Explore the community-made designs and images, as shared by our users.',
        url: 'https://freedesign.fyi',
        siteName: 'Seleneo',
        images: [
            {
                url: 'https://freedesign.fyi/api/og?title=Community',
                width: 1800,
                height: 1600,
                alt: 'Seleneo Community Gallery',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
}


async function getAllPublicImages() {
    const images = await prisma.userImage.findMany({
        where: {
            visibility: "PUBLIC"
        },
        select: {
            id: true,
            cloudflareUrl: true,
            identifier: true,
            visibility: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return images.map(image => ({
        ...image,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toISOString(),
    }));
}

export default async function CommunityPage() {
    const images = await getAllPublicImages();
    const currentUser = await auth.api.getSession({
        headers: headers()
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="h-[calc(100vh-4rem)] w-full p-4">
                {images.length > 0 ? (
                    <ImageGallery
                        images={images}
                        currentUserId={currentUser?.user?.name || ""}
                        title="Community Gallery"
                        description={`Explore the images shared by our community.`}
                    />
                ) : (
                    <div className="h-full w-full relative bg-gradient-to-br from-primary/25 to-background rounded-lg p-4 sm:p-8 lg:p-12 flex flex-col items-center justify-center border shadow-lg border-primary/20">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-center bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Community Gallery
                        </h1>
                        <p className="text-muted-foreground text-center max-w-lg mb-8 px-4 text-sm sm:text-base">
                            Be the first to share your creations with the community! Head over to the Studio to get started.
                        </p>
                        <Button variant="stylish" size="lg" asChild>
                            <Link href="/studio">Go to Studio</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
