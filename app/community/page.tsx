import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ImageGallery } from "./image-gallery";

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
                    currentUserId={currentUser?.user?.id}
                    title="Community Gallery"
                    description={`Explore ${images.length} images shared by our community`}
                />
            </div>
        </div>
    );
}