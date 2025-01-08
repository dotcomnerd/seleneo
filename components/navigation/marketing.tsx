import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { signIn, signOut } from "next-auth/react"
import logo from "@/public/logo.svg";
import { ChevronDown, Menu } from 'lucide-react';
import Link from "next/link";
import { ThemeToggle } from '../theme-toggle';

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/5 dark:bg-transparent backdrop-blur-md z-50 border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-14">
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
                                        <Link href="/about">
                                            About
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild disabled>
                                        <Link href="/examples">
                                            Examples
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="ghost" asChild>
                                <Link href="#features">
                                    Features
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href="#use-cases">
                                    Use Cases
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href="#how-it-works">
                                    How Seleneo Works
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href="#faq">
                                    FAQ
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        <Button onClick={async () => {
                            await signIn("github")
                        }}>
                            Sign In
                        </Button>
                        <Button onClick={async () => {
                            await signOut()
                        }}>
                            Sign Out
                        </Button>
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
                                <Button variant="ghost" asChild>
                                    <Link href="#features">
                                        Features
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href="#faq">
                                        How Seleneo Works
                                    </Link>
                                </Button>
                                <Button variant="ghost" asChild>
                                    <Link href="#faq">
                                        FAQ
                                    </Link>
                                </Button>
                                <div className="flex flex-col gap-2 mt-4">
                                    <Button className="w-full" disabled>Get Started</Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}