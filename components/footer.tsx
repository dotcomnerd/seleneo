import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-muted py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <Link href="/" className="text-2xl font-bold">Seleneo</Link>
                        <p className="text-sm mt-2">© 2023 Seleneo. All rights reserved.</p>
                    </div>
                    <nav className="flex flex-wrap justify-center md:justify-end gap-4">
                        <Link href="#features" className="text-sm hover:text-primary">Features</Link>
                        <Link href="#cta" className="text-sm hover:text-primary">Pricing</Link>
                        <Link href="#faq" className="text-sm hover:text-primary">FAQ</Link>
                        <a href="#" className="text-sm hover:text-primary">Privacy Policy</a>
                        <a href="#" className="text-sm hover:text-primary">Terms of Service</a>
                    </nav>
                </div>
            </div>
        </footer>
    )
}
