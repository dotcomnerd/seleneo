import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from 'next/dist/client/components/headers';

export async function GET(request : Request) {
    try{
        const userData = await auth.api.getSession({
            headers: headers()
        });
        const userId = userData?.user?.id;

        if(!userData?.user || !userId){
            return new Response("Unauthorized: User is not logged in", { status: 401 });
        }

        const lastSavedImage = await prisma.userImage.findFirstOrThrow({
            where: { userId },
            orderBy: { updatedAt: "desc" },
        })

        if (!lastSavedImage) {
            return new Response(null, { status: 200 });
        }

        return Response.json({ lastSavedTime: lastSavedImage.updatedAt }, { status: 200 });
    } catch(error: any){
        return new Response(error.message, { status: 500 });
    }
}
