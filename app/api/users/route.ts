import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function deleteImageFromCloudflare(imageId: string): Promise<void> {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_BEARER_TOKEN}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to delete image from Cloudflare: ${response.statusText}`);
    }
}

export async function DELETE(request: Request) {
    try {
        const userData = await auth();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");

        if (!userData?.user || !userId) return Response.json({ error: "Not logged in" }, { status: 401 });

        const authUser = userData.user;

        if (authUser?.id !== userId) return Response.json({ error: "Unauthorized: Invalid userId" }, { status: 403 });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                UserImage: true,
            },
        });

        if (!user) return Response.json({ error: "User not found" }, { status: 404 });

        const deleteImagePromises = user.UserImage.map(async (image) => {
            const cloudflareId = image.cloudflareUrl.split("/")[4];
            if (cloudflareId) await deleteImageFromCloudflare(cloudflareId);
        });

        await Promise.all(deleteImagePromises);

        await signOut({ redirect: false });

        await prisma.user.delete({ where: { id: userId } });

        return Response.json({ message: "Account successfully deleted" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting account:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
}