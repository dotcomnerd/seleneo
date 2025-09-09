import { toast } from "sonner";

export interface UploadImageResponse {
    imageUrl: string;
    identifier: string;
}

export async function uploadImageToS3(file: File): Promise<UploadImageResponse> {
    try {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Please log in to upload images");
            }
            const errorText = await response.text();
            throw new Error(errorText || "Failed to upload image");
        }

        const result: UploadImageResponse = await response.json();
        return result;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

export function createImageObject(
    file: File,
    imageId: number,
    defaultStyle: any,
    isFirstImage: boolean = false
) {
    const blobUrl = URL.createObjectURL(file);
    
    return {
        id: imageId,
        image: blobUrl,
        isUploaded: false,
        style: isFirstImage ? defaultStyle : {
            ...defaultStyle,
            imageSize: '0.5',
        },
    };
}

export async function uploadAndUpdateImage(
    imageId: number,
    file: File,
    setImages: (images: any[]) => void,
    images: any[]
) {
    try {
        setImages(images.map(img => 
            img.id === imageId 
                ? { ...img, isUploading: true }
                : img
        ));

        const uploadResult = await uploadImageToS3(file);
    
        setImages(images.map(img => 
            img.id === imageId 
                ? {
                    ...img,
                    image: uploadResult.imageUrl,
                    identifier: uploadResult.identifier,
                    isUploaded: true,
                    isUploading: false,
                }
                : img
        ));


        toast.success("Image uploaded successfully");
    } catch (error) {
        console.error("Failed to upload image:", error);
        
        if (error instanceof Error && error.message.includes("Please log in")) {
            toast.info("Please log in to upload images. Using temporary image for now.");
        } else {
            toast.error("Failed to upload image. Please try again.");
        }
        
        setImages(images.map(img => 
            img.id === imageId 
                ? { 
                    ...img, 
                    isUploading: false,
                    isUploaded: false,
                }
                : img
        ));
    }
}

// CC: helpful GPT slop
export function prepImagesForSave(images: any[]) {
    return images.map(img => {
        // The image field already contains the correct URL (upload link or blob)
        // No need to modify it
        return img;
    });
}

export function cleanupBlobUrls(images: any[]) {
    images.forEach(img => {
        if (!img.isUploaded && img.image.startsWith('blob:')) {
            URL.revokeObjectURL(img.image);
        }
    });
}

export function cleanupAllBlobUrls(images: any[]) {
    images.forEach(img => {
        if (img.image.startsWith('blob:')) {
            URL.revokeObjectURL(img.image);
        }
    });
}
