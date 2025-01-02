import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { CallToAction } from "@/components/call-to-action"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <CallToAction />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

