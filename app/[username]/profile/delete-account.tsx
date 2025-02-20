'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { signOut } from '@/lib/auth-client';
import { Trash2 } from "lucide-react";
import { useState } from 'react';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export function DeleteAccount({ userId }: { userId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter()
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/users?id=${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                toast.error('Failed to delete account');
            }

            await signOut()

            router.push('/')
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delete account');
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and all associated data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
