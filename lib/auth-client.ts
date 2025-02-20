import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.BASE_URL! // NOTE: This is optional if our API base URL matches the frontend
});

export const { signIn, signOut, useSession } = authClient;
