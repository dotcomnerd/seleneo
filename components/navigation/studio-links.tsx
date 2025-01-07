import Link from "next/link";
import logo from "@/public/logo.svg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

export function Links() {
    return (
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
                    <DropdownMenuItem asChild disabled>
                        <Link href="/examples">
                            Examples
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
    )
}