import { Links } from "@/components/navigation/studio-links"
import { ExportOptions } from "@/components/studio/export"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function StudioNavbar() {
    return (
        <header className="flex h-14 items-center border-b px-4 shrink-0">
            <Links />
            <div className="ml-auto flex items-center gap-2">
                <ExportOptions />
                <div className="h-4 w-px bg-border" />
                <ThemeToggle />
                <Button disabled>Login</Button>
            </div>
        </header>
    )
}
