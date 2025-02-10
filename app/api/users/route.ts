import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
    try {
        const userData = await auth();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");

        if (!userData?.user || !userId) return Response.json({ error: "Not logged in" }, { status: 401 });

        const authUser = userData.user;

        if (authUser?.id !== userId) return Response.json({ error: "Unauthorized: Invalid userId" }, { status: 403 });

        const response = await fetch(`${process.env.BACKEND_API}/api/v1/users/${userId}`, {
            method: "DELETE",
            headers: {
                "X-Authenticated-User-ID": userId,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete user`);
        }

        await signOut({ redirect: false });

        return new Response(JSON.stringify({ message: "Account successfully deleted" }), { status: 200 });
    } catch (error: any) {
        console.error("Error deleting account:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}