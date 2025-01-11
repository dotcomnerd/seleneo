import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ImageGallery } from "./image-gallery";

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
    const currentUser = await auth();

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[100vw] p-4">
                <ImageGallery
                    images={images}
                    currentUserId={currentUser?.user?.name || ""}
                    title="Community Gallery"
                    description={`Explore the images shared by our community.`}
                />
            </div>
        </div>
    );
}