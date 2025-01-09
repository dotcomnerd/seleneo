import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get("cursor")
    const take = parseInt(searchParams.get("take") || "10", 10)

    try {
        const images = await prisma.userImage.findMany({
            where: {
                visibility: "PUBLIC",
            },
            take,
            skip: cursor ? 1 : 0, 
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
                id: "asc",
            },
        });

        const nextCursor = images.length === take ? images[images.length - 1].id : null;

        return new Response(
            JSON.stringify({
                images,
                nextCursor,
            }),
            { status: 200 }
        );
    } catch (error: any) {
        return new Response(error.message, { status: 500 });
    }
}
