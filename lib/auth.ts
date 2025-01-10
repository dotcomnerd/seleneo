import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id
            return session
        },
    },
})