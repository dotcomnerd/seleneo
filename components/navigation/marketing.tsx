"use client";

import { ThemeToggle } from '@/components/theme-toggle';
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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import logo from "@/public/logo.svg";
import { ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { User as UserType } from 'next-auth';

const UserAvatar = ({ user, className = "h-8 w-8" }:
    { user: UserType | undefined, className?: string }
) => {
    return (
        <Avatar className={className}>
            <AvatarImage
                src={user?.image || '/default-avatar.png'}
                alt={user?.name || 'User avatar'}
            />
            <AvatarFallback>
                <img
                    src="/default-avatar.png"
                    alt="Default avatar"
                    className="h-full w-full object-cover"
                />
            </AvatarFallback>
        </Avatar>
    );
};

export function Navbar() {
    const { data: session, status } = useSession();

    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: '/' });
    };

    const renderAuthButton = () => {
        if (status === 'loading') {
            return (
                <Button disabled className="gap-2">
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
                                        You'll need to sign in again to access your account.
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
            <Button onClick={() => signIn("github")}>
                Sign In
            </Button>
        );
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/5 dark:bg-transparent backdrop-blur-md z-50 border-b w-screen">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <img src={logo.src} className="size-8" alt='Seleneo Logo' />
                            <span className="text-xl font-semibold">Seleneo</span>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                Pre-release
                            </span>
                        </Link>
                        <div className="hidden md:flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2">
                                        Resources
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <Link href="/about" className="flex items-center gap-2">
                                            About
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild disabled>
                                        <Link href="/examples" className="flex items-center gap-2">
                                            Examples
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="ghost" asChild>
                                <Link href="#features">Features</Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href="#use-cases">Use Cases</Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href="#how-it-works">How Seleneo Works</Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href="#faq">FAQ</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        {renderAuthButton()}
                        <Button disabled>Get Started</Button>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-8">
                                {status === 'authenticated' && session && (
                                    <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-lg bg-secondary/20">
                                        <UserAvatar
                                            user={session.user}
                                            className="h-10 w-10"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{session.user?.name}</span>
                                            <span className="text-sm text-muted-foreground">{session.user?.email}</span>
                                        </div>
                                    </div>
                                )}
                                <Button variant="ghost" asChild>
                                    <Link href="#features">Features</Link>
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href="#how-it-works">How Seleneo Works</Link>
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href="#faq">FAQ</Link>
                                </Button>
                                {status === 'authenticated' ? (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="mt-2">
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Sign Out
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    You'll need to sign in again to access your account.
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
                                ) : (
                                    <Button onClick={() => signIn("github")} className="mt-2">
                                        Sign In
                                    </Button>
                                )}
                                <Button className="w-full" disabled>Get Started</Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}