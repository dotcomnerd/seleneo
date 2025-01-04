"use client";

import dynamic from 'next/dynamic';
import { Header as OldNavBar } from "@/components/header"
import { Hero as OldHero } from "@/components/hero"
import { Hero as NewHero } from "@/components/marketing/hero/main"
import { Features as OldFeatures } from "@/components/features"
import { Features as NewFeatures } from "@/components/marketing/features/main"
import { CallToAction } from "@/components/marketing/call-to-action"
import { FAQ } from "@/components/marketing/faq"
import { Footer as OldFooter } from "@/components/footer"
import { Footer as NewFooter } from "@/components/marketing/footer"
import { Navbar as NewNavbar } from "@/components/marketing/nav"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { ProductShowcase } from "@/components/marketing/product"
import { FloatingElements } from "@/components/marketing/floating-icons"

const LazyFloatingElements = dynamic(() => import('@/components/marketing/floating-icons').then(mod => mod.FloatingElements), {
  loading: () => <div>Loading...</div>,
  ssr: true
});

const LazyProductShowcase = dynamic(() => import('@/components/marketing/product').then(mod => mod.ProductShowcase), {
  loading: () => <div>Loading...</div>,
  ssr: true
});

const LazyFeatures = dynamic(() => import('@/components/marketing/features/main').then(mod => mod.Features), {
  loading: () => <div>Loading...</div>,
  ssr: true
});

const LazyHowItWorks = dynamic(() => import('@/components/marketing/how-it-works').then(mod => mod.HowItWorks), {
  loading: () => <div>Loading...</div>,
  ssr: true
});

const LazyCallToAction = dynamic(() => import('@/components/marketing/call-to-action').then(mod => mod.CallToAction), {
  loading: () => <div>Loading...</div>,
  ssr: true
});

const LazyFAQ = dynamic(() => import('@/components/marketing/faq').then(mod => mod.FAQ), {
  loading: () => <div>Loading...</div>,
  ssr: true
});

export default function LandingPage() {
  return (
    <>
      <NewNavbar />
      <main>
        <NewHero />
        <LazyFloatingElements />
        <LazyProductShowcase />
        <LazyFeatures />
        <LazyHowItWorks />
        <LazyCallToAction />
        <LazyFAQ />
      </main>
      <NewFooter />
    </>
  )
}