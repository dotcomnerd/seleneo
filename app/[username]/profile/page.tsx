import { StudioNavbar } from "@/components/navigation/studio";
import Spinner from "@/components/spinner/spinner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    Images,
    Mail,
    User as UserIcon
} from "lucide-react";
import type { Metadata, ResolvingMetadata } from 'next';
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DeleteAccount } from "./delete-account";
import { ImageModal } from "./image-modal";

export const dynamic = 'force-dynamic'

async function getUser(name: string, isCurrentUser = false) {
    if (!name) {
        return null;
    }

    const user = await prisma.user.findFirst({
        where: { name },
        select: {
            id: true,
            name: true,
            image: true,
            email: true,
            UserImage: {
                select: {
                    id: true,
                    cloudflareUrl: true,
                    visibility: true,
                    identifier: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
        },
    });

    // don't show private images if the user is not the current user c:
    if (!isCurrentUser && user?.UserImage) {
        user.UserImage = user.UserImage.filter(image => image.visibility === "PUBLIC");
    }

    return user;
}


type Props = {
    params: Promise<{ username: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const id = (await params).username;
    const user = await getUser(id) ?? null;
    let name = user?.name ?? "";
    name.length > 10 ? name = `${name.slice(0, 10)}...` : name;

    return {
        generator: 'Next.js Baby!',
        applicationName: 'Seleneo',
        title: `${name}'s Profile - Seleneo`,
        description: `Explore ${name}'s generated images within Seleneo`,
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
            canonical: `/`,
        },
        openGraph: {
            title: `${name}'s Profile - Seleneo`,
            description: `Explore ${name}'s designs and images, as shared on Seleneo.`,
            url: `https://freedesign.fyi/${name}/profile`,
            siteName: 'Seleneo',
            images: [
                {
                    url: `https://freedesign.fyi/api/og?title=${name}`,
                    width: 1800,
                    height: 1600,
                    alt: `${name}'s Profile Image`,
                },
            ],
            locale: 'en_US',
            type: 'profile',
        },
    } as Metadata

}

export default async function ProfilePage({ params }: { params: { username: string } }) {
    const currentUser = await auth();
    const profile = await getUser(params.username, currentUser?.user?.name === params.username);
    const isOwnProfile = currentUser?.user && profile && currentUser.user?.id === profile.id;

    if (!profile) redirect("/404");

    return (
        <div className="min-h-screen bg-background">
            <StudioNavbar />
            <div className="container mx-auto px-4 py-20 md:py-32 max-w-7xl">
                <div className="grid grid-cols-1 gap-8">
                    <Card>
                        <Suspense fallback={<div className="flex-center h-96"><Spinner /></div>}>
                            <div className="flex flex-col md:flex-row">
                                <div className="flex-center flex-col p-8 md:w-72 border-b md:border-b-0 md:border-r">
                                    <Avatar className="h-32 w-32">
                                        <AvatarImage src={profile.image ?? ""} alt={profile.name ?? ""} />
                                        <AvatarFallback>
                                            <UserIcon className="h-16 w-16" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="mt-4 text-center">
                                        <h2 className="text-2xl font-semibold">{profile.name}</h2>
                                        <p className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            {profile.email}
                                        </p>
                                    </div>
                                    <div className="w-full mt-6">
                                        {isOwnProfile && (
                                            <DeleteAccount userId={profile.id} />
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 p-8">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Images className="h-5 w-5" />
                                        <h3 className="text-xl font-semibold ml-2">
                                            {isOwnProfile ? "Your Seleneo Collection" : `${profile.name}'s Collection`}
                                        </h3>
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                                            ({profile.UserImage?.length || 0} images)
                                        </span>
                                    </div>

                                    {profile.UserImage && profile.UserImage.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {profile.UserImage.map((image) => (
                                                <ImageModal
                                                    key={image.id}
                                                    image={{
                                                        ...image,
                                                        createdAt: image.createdAt.toISOString(),
                                                        updatedAt: image.updatedAt.toISOString(),
                                                    }}
                                                    isOwner={isOwnProfile || false}
                                                    name={profile.name ?? ""}
                                                >
                                                    <div className="cursor-pointer group relative overflow-hidden rounded-lg border bg-background">
                                                        <AspectRatio ratio={16 / 9}>
                                                            <img
                                                                src={image.cloudflareUrl}
                                                                alt={image.identifier}
                                                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                                            />
                                                        </AspectRatio>
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="absolute bottom-4 left-4">
                                                                <p className="text-white/80 text-sm">
                                                                    {new Date(image.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ImageModal>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex-center flex-col py-12 text-muted-foreground">
                                            <Images className="h-12 w-12 mb-4 opacity-50" />
                                            <p>No images uploaded to Seleneo yet : (</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Suspense>
                    </Card>
                </div>
            </div>
        </div>
    );
}