"use client";

import { Links } from "@/components/navigation/studio-links"
import { ExportOptions } from "@/components/studio/export"
import { ThemeToggle } from "@/components/theme-toggle"
import { signIn, signOut, useSession } from "next-auth/react";
import { ChevronDown, LogOut, User } from "lucide-react";
import Spinner from '@/components/spinner/spinner';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/navigation/marketing";
import Link from "next/link";

export function StudioNavbar() {
    const { data: session, status } = useSession();

     const handleSignOut = async () => {
         await signOut
             ({ redirect: true, callbackUrl: '/' });
     };

    const renderAuthButton = () => {
        if (status === 'loading') {
            return (
                <Button disabled variant={"stylish"} className="gap-2">
                    <Spinner />
                    <span>Loading...</span>
                </Button>
            );
        }

        if (status === 'authenticated' && session) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2 p-1">
                            <UserAvatar user={session.user} />
                            <span className="ml-2">{session.user?.name}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem asChild>
                            <Link href="/account" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Account
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 dark:text-red-400">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You won't be able to save your changes.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleSignOut}
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                    >
                                        Sign Out
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        return (
            <Button onClick={() => signIn("github", { redirectTo: "/studio" })} variant={"stylish"}>
                Sign In
            </Button>
        );
    };


    return (
        <header className="flex h-14 items-center border-b px-4 shrink-0">
            <Links />
            <div className="ml-auto flex items-center gap-2">
                <ExportOptions />
                <div className="h-4 w-px bg-border" />
                <ThemeToggle />
                {renderAuthButton()}
            </div>
        </header>
    )
}
