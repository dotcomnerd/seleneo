import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub({
        profile(profile) {
            return {
                id: profile.id.toString(),
                name: profile.login,
                email: profile.email,
                image: profile.avatar_url
            }
        }
    })],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id
            return session
        },
        async signIn({ user, profile }) {
            if (profile && 'login' in profile) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { name: true }
                })

                if (dbUser?.name?.includes(' ')) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: profile.login as string }
                    })
                }
            }
            return true
        },
    },
})