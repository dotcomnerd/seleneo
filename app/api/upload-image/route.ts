import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

// didnt work on edge runtime
export const runtime = "nodejs";

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Max file size for Cloudflare Images (paywall things like this?)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export type UploadImageResponse = {
    imageUrl: string;
    identifier: string;
}

async function uploadImageToCloudflare(file: File, userId: string): Promise<UploadImageResponse> {
    // TODO: change this to be the imageID
    const identifier = `canvas-image-${Date.now()}-${uuidv4().toString()}`;
    
    // Security checks
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed. Only ${ALLOWED_IMAGE_TYPES.join(', ')} are allowed.`);
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size ${file.size} exceeds maximum allowed size of ${MAX_FILE_SIZE} bytes.`);
    }

    try {
        const processedFormData = new FormData();
        processedFormData.append("file", file);
        processedFormData.append("requireSignedURLs", "false");
        
        const metadata = {
            timestamp: new Date().toISOString(),
            userId: userId,
            // projectId: null, // null for now
            identifier: identifier
        };
        processedFormData.append("metadata", JSON.stringify(metadata));

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.CLOUDFLARE_BEARER_TOKEN}`,
                },
                body: processedFormData,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cloudflare API error: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        const imageUrl = result.result.variants[0];

        await prisma.canvasImage.create({
            data: {
                userId,
                // projectId: null, // null for now
                cloudflareUrl: imageUrl,
                identifier,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return {
            imageUrl,
            identifier,
        };
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : "Failed to upload image to Cloudflare");
    }
}

export async function POST(request: Request) {
    try {
        const userData = await auth();
        const userId = userData?.user?.id;

        if (!userData?.user || !userId) {
            return new Response("Unauthorized: User must be logged in to upload images", { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response("No file provided", { status: 400 });
        }

        if (!file.type.startsWith('image/')) {
            return new Response("File must be an image", { status: 400 });
        }

        const result = await uploadImageToCloudflare(file, userId);
        
        return Response.json(result);
    } catch (error: any) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}
