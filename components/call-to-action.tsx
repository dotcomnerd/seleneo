import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CallToAction() {
    return (
        <section id="cta" className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to get started?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                    Join thousands of designers and entrepreneurs who are already using Seleneo to create stunning visuals.
                </p>
                <Button asChild size="lg" variant="secondary">
                    <Link href="/studio">Start Designing Now</Link>
                </Button>
            </div>
        </section>
    )
}
