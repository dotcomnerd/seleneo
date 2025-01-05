"use client";

import dynamic from 'next/dynamic';
import { Hero as NewHero } from "@/components/marketing/hero/main"
import { Footer as NewFooter } from "@/components/marketing/footer"
import { Navbar as NewNavbar } from "@/components/marketing/nav"
import { Features as OldFeatures } from "@/components/features"
import { Features as NewFeatures } from "@/components/marketing/features/main"
import { CallToAction } from "@/components/marketing/call-to-action"
import { FAQ } from "@/components/marketing/faq"
import { Header as OldNavBar } from "@/components/header"
import { Hero as OldHero } from "@/components/hero"
import { Footer as OldFooter } from "@/components/footer"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { ProductShowcase } from "@/components/marketing/product"
import { FloatingElements } from "@/components/marketing/floating-icons"


export default function LandingPage() {
  return (
    <>
      <NewNavbar />
      <main>
        <NewHero />
        <FloatingElements />
        <NewFeatures />
        <ProductShowcase />
        <HowItWorks />
        <CallToAction />
        <FAQ />
      </main>
      <NewFooter />
    </>
  )
}