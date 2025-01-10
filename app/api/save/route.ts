import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { useLastSavedTime } from "@/store/use-last-save";

async function uploadImageToCloudflare(file: FormData): Promise<{ imageUrl: string; identifier: string }> {
    const identifier = file.get("identifier") as string;
    file.delete("identifier");

    try{
        file.append("requireSignedURLs", "false");

        console.log("Uploading image to Cloudflare");
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.CLOUDFLARE_BEARER_TOKEN}`,
                },
                body: file,
            }
        );

        console.log("Image uploaded to Cloudflare, checking ");
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        console.log("Image uploaded to Cloudflare, getting result");
        const result = await response.json();
        return {
            imageUrl: result.result.variants[0],
            identifier,
        };
    }
    catch(error){
        console.error(error);
        throw new Error("Failed to upload image to Cloudflare");
    }
}

async function saveOrUpdateUserImage(userId: string, imageUrl: string, identifier: string, visibility: "PUBLIC" | "PRIVATE"): Promise<string> {
    const existingImage = await prisma.userImage.findFirst({
        where: { userId, identifier },
    });

    console.log("Existing image", existingImage);
    if (existingImage) {
        await prisma.userImage.update({
            where: { id: existingImage.id },
            data: { cloudflareUrl: imageUrl, updatedAt: new Date() },
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
        const userData = await auth();
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
        formData.delete("visibility");

        const { imageUrl, identifier } = await uploadImageToCloudflare(formData);

        useLastSavedTime.getState().setLastSavedTime(new Date());
        if (!visibility || !["PUBLIC", "PRIVATE"].includes(visibility)) {
            throw new Error("Visibility must be provided");
        }

        const message = await saveOrUpdateUserImage(userId, imageUrl, identifier, visibility);

        return Response.json({ message, visibility, status: 200 });
    } catch (error: any) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}
