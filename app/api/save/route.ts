import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function uploadImageToCloudflare(file: FormData): Promise<string> {
    file.append("requireSignedURLs", "false");
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

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const result = await response.json();
    return result.result.variants[0]; 
}

async function saveOrUpdateUserImage(userId: string, imageUrl: string) {
    const existingImage = await prisma.userImage.findFirst({
        where: { userId },
    });

    if (existingImage) {
        await prisma.userImage.update({
            where: { id: existingImage.id },
            data: { cloudflareUrl: imageUrl },
        });
        return "Image updated successfully";
    } else {
        await prisma.userImage.create({
            data: {
                userId,
                cloudflareUrl: imageUrl,
                visibility: "PUBLIC",
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

        const imageUrl = await uploadImageToCloudflare(formData);

        const message = await saveOrUpdateUserImage(userId, imageUrl);

        return Response.json({ message, status: 200 });
    } catch (error: any) {
        return new Response(error.message, { status: 500 });
    }
}
