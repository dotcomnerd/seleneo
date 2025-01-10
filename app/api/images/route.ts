import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DELETE(request: Request) {
    try {
        const userData = await auth();
        const name = userData?.user?.name || "";
        const userId = userData?.user?.id;
        if (!userData?.user || !userId) return new Response("Not logged in", { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id")
        if (!id) return new Response("Image ID is required", { status: 400 });

        const session = await prisma.session.findFirstOrThrow({
            where: { userId },
        });

        if (!session) return new Response("Session not found", { status: 401 });

        const image = await prisma.userImage.findFirst({
            where: { id, userId },
        });

        if (!image) return new Response("Not found", { status: 404 });

        await prisma.userImage.delete({
            where: { id },
        });

        const idFromImageUrl = image.cloudflareUrl.split("/")[4];

        const cloudflareDeleteResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${idFromImageUrl}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${process.env.CLOUDFLARE_BEARER_TOKEN}`,
                },
            }
        );

        if (!cloudflareDeleteResponse.ok) return new Response("Failed to delete image from Cloudflare", { status: 500 });

        revalidatePath(('/api/images'));
        revalidatePath('/images');
        revalidatePath(`/${encodeURIComponent(name)}/profile`);
        return new Response("Image deleted successfully", { status: 200 });
    } catch (error: any) {
        console.error(error);
        return new Response("Internal server error", { status: 500 });
    }
}