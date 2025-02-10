import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { useLastSavedTime } from "@/store/use-last-save";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    try {
        const userData = await auth();
        const userId = userData?.user?.id;

        if (!userData?.user || !userId) {
            return new Response("Unauthorized: User is not logged in", { status: 401 });
        }

        const session = await prisma.session.findFirst({
            where: { userId },
        });

        if (!session) {
            return new Response("Unauthorized: Session not found", { status: 401 });
        }

        const formData = await request.formData();
        const visibility = formData.get("visibility") as "PUBLIC" | "PRIVATE";
        if (!visibility || !["PUBLIC", "PRIVATE"].includes(visibility)) {
            return new Response("Invalid visibility. Must be PUBLIC or PRIVATE", { status: 400 });
        }
        formData.append("userId", userId);

        const goResponse = await fetch(`${process.env.BACKEND_API}/api/v1/save`, {
            method: "POST",
            body: formData,
        });

        if (!goResponse.ok) {
            throw new Error(await goResponse.text());
        }

        const result = await goResponse.json();

        if (result.type === "NEW_SAVE") {
            useLastSavedTime.getState().setLastSavedTime(new Date());
            revalidatePath("/community");
            revalidatePath(`/${userData.user.name}/profile`);
            revalidatePath(`/${encodeURIComponent(userData?.user?.name ?? "")}/profile`);
        }

        return Response.json(result);
    } catch (error: any) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}