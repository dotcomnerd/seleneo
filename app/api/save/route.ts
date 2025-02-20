import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { useLastSavedTime } from "@/store/use-last-save";
import { diff, Jimp } from 'jimp';
import { revalidatePath } from "next/cache";
import { headers } from 'next/headers';


export const runtime = "nodejs";

const SIMILARITY_THRESHOLD = 70;

async function compareImages(img1Buffer: Buffer, img2Buffer: Buffer): Promise<number> {
    try {
        const jimage1 = await Jimp.read(img1Buffer);
        const jimage2 = await Jimp.read(img2Buffer);

        const { percent } = diff(jimage1, jimage2, 0.1);
        const howSimilarImagesAre = 100 - (percent * 100);

        return howSimilarImagesAre;
    } catch (error) {
        console.error('compareImages error:', error);
        throw error;
    }
}

async function checkImageSimilarity(newImageBuffer: Buffer, viz: "PUBLIC" | "PRIVATE"): Promise<{ isSimilar: boolean; whichImage?: string }> {
    const existingImages = await prisma.userImage.findMany({
        where: {
            visibility: viz,
        },
    });

    for (const image of existingImages) {
        try {
            const buffer = await fetch(image.cloudflareUrl).then((res) => res.arrayBuffer());
            const existingImageBuffer = Buffer.from(buffer);

            const similarityPercentage = await compareImages(newImageBuffer, existingImageBuffer);

            if (similarityPercentage > SIMILARITY_THRESHOLD) return { isSimilar: true, whichImage: image.id };
            else continue;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to compare images");
        }
    }

    return { isSimilar: false };
}

export type UploadImageNonExisting = {
    imageUrl: string;
    identifier: string;
}

export type UploadImageExisting = {
    id: string;
    cloudflareUrl: string;
    identifier: string;
    isOwner: boolean;
}

async function uploadImageToCloudflare(file: FormData, userId: string, viz: "PUBLIC" | "PRIVATE"): Promise<UploadImageNonExisting | UploadImageExisting> {
    const identifier = file.get("identifier") as string;
    const imageFile = file.get("file") as File;
    file.delete("identifier");

    const arrayBuffer = await imageFile.arrayBuffer();
    let fileBuffer = Buffer.from(arrayBuffer);

    const fileType = imageFile.type.split('/')[1].toUpperCase();

    /*
    // TODO: Remove this once we have a better way to handle the file type
    if (!FILE_TYPES.includes(fileType as any)) {
        fileBuffer = await sharp(fileBuffer)
            .png()
            .toBuffer();
    }
    */

    try {
        const { isSimilar, whichImage } = await checkImageSimilarity(fileBuffer, viz);

        if (isSimilar) {
            const image = await prisma.userImage.findUnique({
                where: { id: whichImage },
            });

            if (!image) {
                throw new Error("Image not found");
            }

            return {
                ...image,
                identifier,
                isOwner: image.userId === userId,
            }
        }

        const processedFormData = new FormData();
        processedFormData.append("file", new Blob([fileBuffer]), `image.${fileType.toLowerCase()}`);
        processedFormData.append("requireSignedURLs", "false");

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.CLOUDFLARE_BEARER_TOKEN}`,
                },
                body: processedFormData,
            }
        );

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const result = await response.json();
        return {
            imageUrl: result.result.variants[0],
            identifier,
        };
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : "Failed to upload image to Cloudflare");
    }
}

async function saveOrUpdateUserImage(userId: string, imageUrl: string, identifier: string, visibility: "PUBLIC" | "PRIVATE"): Promise<string> {
    const existingImage = await prisma.userImage.findFirst({
        where: { userId, identifier },
    });

    if (existingImage) {
        await prisma.userImage.update({
            where: { id: existingImage.id },
            data: { cloudflareUrl: imageUrl, updatedAt: new Date(), visibility },
        });
        return "Image updated successfully";
    } else {
        await prisma.userImage.create({
            data: {
                userId,
                cloudflareUrl: imageUrl,
                visibility,
                identifier,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
        return "Image saved successfully";
    }
}

export async function POST(request: Request) {
    try {
        const userData = await auth.api.getSession({
            headers: headers()
        });
        const userId = userData?.user?.id;

        if (!userData?.user || !userId) {
            return new Response("Unauthorized: User is not logged in", { status: 401 });
        }

        const session = await prisma.session.findFirstOrThrow({
            where: { userId },
        });

        if (!session) {
            return new Response("Unauthorized: Session not found", { status: 401 });
        }

        const formData = await request.formData();
        const visibility = formData.get("visibility") as "PUBLIC" | "PRIVATE";
        if (!visibility || !["PUBLIC", "PRIVATE"].includes(visibility)) throw new Error("Visibility must be provided");

        const maybeExists = await uploadImageToCloudflare(formData, userId, visibility);

        if ('id' in maybeExists) {
            const { id, cloudflareUrl, identifier, isOwner } = maybeExists;
            // 204 status means duplicate image
            return Response.json({ id, cloudflareUrl, identifier, isOwner, status: 204, type: "DUPLICATE", visibility, message: "Design already exists" });
        } else {
            const { imageUrl, identifier } = maybeExists;
            const message = await saveOrUpdateUserImage(userId, imageUrl, identifier, visibility);
            useLastSavedTime.getState().setLastSavedTime(new Date());
            revalidatePath("/community");
            revalidatePath(`/${userData.user.name}/profile`);
            revalidatePath(`/${encodeURIComponent(userData?.user?.name??"")}/profile`);
            return Response.json({ message, status: 200, type: "NEW_SAVE", visibility });
        }
    } catch (error: any) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}
