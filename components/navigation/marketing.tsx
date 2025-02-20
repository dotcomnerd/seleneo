"use client";

import { authClient, signIn, useSession } from "@/lib/auth-client";
import { ChevronDown, GalleryVertical, LogOut, Menu, UserIcon } from 'lucide-react';
import Link from "next/link";
import * as React from "react";
import { type User } from 'better-auth';
import { useRouter } from 'next/navigation';

import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from "@/lib/utils";
import logo from "@/public/logo.svg";
import icon from "@/public/logo.webp";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const productItems = [
    {
        title: "Features",
        href: "#features",
        description: "Explore the powerful features that make Seleneo awesome."
    },
    {
        title: "Use Cases",
        href: "#use-cases",
        description: "Discover how you can leverage Seleneo in your workflows."
    },
    {
        title: "How it Works",
        href: "#how-it-works",
        description: "See the simple workflow to get started with Seleneo."
    },
    {
        title: "FAQ",
        href: "#faq",
        description: "Frequently asked questions about Seleneo."
    },
    {
        title: "GitHub",
        href: "http://github.com/dotcomnerd/seleneo",
        description: "View the source code and contribute to make Seleneo better!"
    }
];

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

export const UserAvatar = ({ user, className = "h-8 w-8" }: {
    user: User | undefined,
    className?: string
}) => (
    <Avatar className={className}>
        <AvatarImage src={user?.image || '/default-avatar.png'} alt={user?.name || 'User avatar'} />
        <AvatarFallback>
            <img src="/default-avatar.png" alt="Default avatar" className="h-full w-full object-cover" />
        </AvatarFallback>
    </Avatar>
);

const SignOutDialog = ({ onSignOut }: { onSignOut: () => Promise<void> }
) => (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 dark:text-red-400">
                <LogOut className="h-4 w-4 mr-2" />Sign Out
            </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                <AlertDialogDescription>You'll need to sign in again to access your account.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onSignOut} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
                    Sign Out
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export function Navbar() {
    const { data: session, isPending: loading, error } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = React.useState(false);

    const platformItems = React.useMemo(() => session ? [
        { title: "About", href: "/about", description: "Learn more about our mission and team." },
        { title: "Community", href: "/community", description: "Join our growing community of developers." },
        { title: "Studio", href: "/studio", description: "Access your development workspace." },
        {
            title: "Profile",
            href: `/${session?.user?.name}/profile`,
            description: "Manage your account settings and preferences."
        }
    ] : [], [session]);

    const handleSignOut = React.useCallback(async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/')
                }
            }
        })
    }, [router]);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/5 dark:bg-transparent backdrop-blur-md z-50 border-b-[1px] border-primary/20 w-screen">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <img src={logo.src} className="size-8" alt='Seleneo Logo' />
                            <span className="text-xl font-semibold">Seleneo</span>
                            {/* <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                Pre-release
                            </span> */}
                        </Link>

                        <NavigationMenu className="hidden md:flex">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-br from-primary/15 to-primary/5 dark:bg-gradient-to-br dark:from-primary/30 dark:to-primary/5  p-6 no-underline outline-none focus:shadow-md"
                                                        href="/about"
                                                    >
                                                        <img src={icon.src} className="h-6 w-6" alt="Logo" loading="eager" />
                                                        <div className="mb-2 mt-4 text-lg font-medium">
                                                            Seleneo
                                                        </div>
                                                        <p className="text-sm leading-tight text-muted-foreground">
                                                            Read more about why we built Seleneo and how it can help you.
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            {productItems.map((item) => (
                                                <ListItem
                                                    key={item.href}
                                                    title={item.title}
                                                    href={item.href}
                                                >
                                                    {item.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                            {platformItems.map((item) => (
                                                <ListItem
                                                    key={item.href}
                                                    title={item.title}
                                                    href={item.href}
                                                >
                                                    {item.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        {error ? (
                            <Button variant="stylish" onClick={() => signIn.social({ provider: "github" })}>Sign In</Button>
                        ) : !session ? (
                            <Button variant="stylish" onClick={() => signIn.social({ provider: "github" })}>Sign In</Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2 p-1">
                                        <UserAvatar user={session.user} />
                                        <span className="ml-2">{session.user?.name}</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 border-primary/20">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/${session.user?.name}/profile`} className="flex items-center gap-2">
                                            <UserIcon className="h-4 w-4" />Account
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/community" className="flex items-center gap-2" prefetch={true}>
                                            <GalleryVertical className="h-4 w-4" />Community
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-primary/20" />
                                    <SignOutDialog onSignOut={handleSignOut} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-8">
                                {session && (
                                    <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-lg bg-secondary/20">
                                        <UserAvatar user={session.user} className="h-10 w-10" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{session.user?.name}</span>
                                            <span className="text-sm text-muted-foreground">{session.user?.email}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <h3 className="px-2 text-lg font-semibold">Product</h3>
                                    {productItems.map((item) => (
                                        <Button
                                            key={item.href}
                                            variant="ghost"
                                            className="w-full justify-start"
                                            asChild
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link href={item.href}>{item.title}</Link>
                                        </Button>
                                    ))}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="px-2 text-lg font-semibold">Platform</h3>
                                    {platformItems.map((item) => (
                                        <Button
                                            key={item.href}
                                            variant="ghost"
                                            className="w-full justify-start"
                                            asChild
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link href={item.href}>{item.title}</Link>
                                        </Button>
                                    ))}
                                </div>

                                {session ? (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="mt-2">
                                                <LogOut className="h-4 w-4 mr-2" />Sign Out
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
                                    <Button
                                        onClick={() => signIn.social({ provider: "github", callbackURL: "/" })}
                                        variant="stylish"
                                        className="mt-2"
                                    >
                                        Sign In
                                    </Button>
                                )}
                                <div className="mt-2">
                                    <ThemeToggle />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
