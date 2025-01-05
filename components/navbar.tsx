import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import logo from "@/public/logo.svg"
import { ChevronDown, Copy, Download } from 'lucide-react'
import Link from "next/link"

export function Navbar() {
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
                    <Link href="/about">
                    About
                    </Link>
                    </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/examples">
                    Examples
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost">About</Button>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost">1x</Button>
                <Button variant="ghost">PNG</Button>
                <ThemeToggle />
                <Button>Login</Button>
            </div>
        </header>
    )
}
