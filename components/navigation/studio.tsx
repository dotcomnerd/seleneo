"use client";

import { ChevronDown, Frame, GalleryVertical, Github, Info, LogOut, LucideIcon, Menu, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { UserAvatar } from "@/components/navigation/marketing";
import Spinner from '@/components/spinner/spinner';
import { ExportOptions } from "@/components/studio/export";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.svg";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ResourceItem {
    title: string;
    href: string;
    description: string;
    icon: LucideIcon;
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
    title: string;
    icon?: LucideIcon;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
    ({ className, title, children, icon: Icon, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "flex select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            <div>
                                <div className="text-sm font-medium leading-none mb-1">{title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {children}
                                </p>
                            </div>
                        </div>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = "ListItem";

export function StudioNavbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: '/' });
    };

    const resourceItems: ResourceItem[] = [
        {
            title: "About",
            href: "/about",
            description: "Learn more about Seleneo, the team behind it, and why we built it.",
            icon: Info
        },
        {
            title: "Community",
            href: "/community",
            description: "View the community gallery and explore the work of other Seleneo creators.",
            icon: GalleryVertical
        },
        {
            title: "GitHub",
            href: "https://github.com/dotcomnerd/seleneo",
            description: "Access our open-source repository and contribute to development of Seleneo!",
            icon: Github
        },
        {
            title: "Studio",
            href: "/studio",
            description: "Start creating your own designs with Seleneo's 100% free, and 100% powerful canvas.",
            icon: Frame
        }
    ];

    const renderAuthButton = () => {
        if (status === 'loading') {
            return (
                <Button disabled variant="stylish" className="gap-2">
                    <Spinner /><span>Loading...</span>
                </Button>
            );
        }

        if (status === 'authenticated' && session) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2 p-1 px-2 -mx-2">
                            <UserAvatar user={session.user} />
                            <span className="ml-2">{session.user?.name}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 border-primary/20">
                        <DropdownMenuItem asChild>
                            <Link href={`/${session?.user?.name}/profile`} className="flex items-center gap-2" prefetch={true}>
                                <User className="h-4 w-4" />Account
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/community" className="flex items-center gap-2" prefetch={true}>
                                <GalleryVertical className="h-4 w-4" />Community
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-primary/20" />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 dark:text-red-400">
                                    <LogOut className="h-4 w-4 mr-2" />Sign Out
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
            <Button onClick={() => signIn("github", { redirectTo: "/studio" })} variant="stylish">
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
                    {/* <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Pre-release
                    </span> */}
                </Link>

                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4">
                                    {resourceItems.map((item) => (
                                        <ListItem
                                            key={item.href}
                                            title={item.title}
                                            href={item.href}
                                            icon={item.icon}
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

            <div className="ml-auto flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                    <ExportOptions />
                    <div className={cn("", {
                        "hidden": !pathname.includes("/studio"),
                        "h-4 w-px bg-border": pathname.includes("/studio")
                    })} />
                    <ThemeToggle />
                    {renderAuthButton()}
                </div>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <Link href="/" className="flex items-center gap-2">
                                <img src={logo.src} className="size-8" alt="Seleneo Logo" />
                                <SheetTitle>Seleneo
                                </SheetTitle>
                            </Link>
                        </SheetHeader>
                        <div className="flex flex-col gap-4 mt-8">
                            {status === 'authenticated' && session && (
                                <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-lg bg-secondary/20">
                                    <UserAvatar user={session.user} className="h-10 w-10" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{session.user?.name}</span>
                                        <span className="text-sm text-muted-foreground">{session.user?.email}</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <h3 className="px-2 text-lg font-semibold">Resources</h3>
                                {resourceItems.map((item) => (
                                    <Button
                                        key={item.href}
                                        variant="ghost"
                                        className="w-full justify-start gap-2"
                                        asChild
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4" />
                                            {item.title}
                                        </Link>
                                    </Button>
                                ))}
                            </div>

                            {status === 'authenticated' ? (
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
                            ) : (
                                <Button
                                    onClick={() => signIn("github", { redirectTo: "/studio" })}
                                    variant="stylish"
                                    className="mt-2"
                                >
                                    Sign In
                                </Button>
                            )}
                            <div className="mt-2">
                                <ExportOptions />
                                <ThemeToggle />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}