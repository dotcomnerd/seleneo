"use client";

import { UserAvatar } from "@/components/navigation/marketing";
import Spinner from '@/components/spinner/spinner';
import { ExportOptions } from "@/components/studio/export";
import { ThemeToggle } from "@/components/theme-toggle";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.svg";
import icon from "@/public/logo.webp";
import { ChevronDown, Frame, GalleryVertical, LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StudioNavbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

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
                            <Link href={`/${session?.user?.name}/profile`} className="flex items-center gap-2" prefetch={true}>
                                <User className="h-4 w-4" />
                                Account
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/community`} className="flex items-center gap-2" prefetch={true}>
                                <GalleryVertical className="h-4 w-4" />
                                Community
                            </Link>
                        </DropdownMenuItem>
                        {!pathname.includes("/studio") && (
                            <DropdownMenuItem asChild>
                                <Link href={`/studio`} className="flex items-center gap-2" prefetch={true}>
                                    <Frame className="h-4 w-4" />
                                    Studio
                                </Link>
                            </DropdownMenuItem>
                        )}
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
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                    <img src={logo.src} className="size-8" alt="Seleneo Logo" />
                    <span className="text-xl font-semibold">Seleneo</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Pre-release
                    </span>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2">
                            Resources
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href="https://github.com/dotcomnerd/seleneo">
                                GitHub
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/community" prefetch={true}>
                                Community
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/about">
                                About
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Button variant="ghost">
                <Link href="/community" prefetch={true}>
                    <div className="flex flex-row items-center gap-2">
                        <img src={icon.src} alt="Logo" className="h-6 w-6" />
                        <span className="sr-only">Go to Community Hub</span>
                        <p>Community</p>
                    </div>
                </Link>
            </Button>
            <div className="ml-auto flex items-center gap-2">
                <ExportOptions />
                <div className={cn("", { "hidden": !pathname.includes("/studio"), "h-4 w-px bg-border": pathname.includes("/studio") })} />
                <ThemeToggle />
                {renderAuthButton()}
            </div>
        </header>
    )
}
