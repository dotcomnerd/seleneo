import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Copy, Download } from 'lucide-react'
import { Links } from "./studio-links"

export function StudioNavbar() {
    return (
        <header className="flex h-14 items-center border-b px-4 shrink-0">
            <Links />
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
