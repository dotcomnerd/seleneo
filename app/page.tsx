"use client";

import { CallToAction } from "@/components/marketing/call-to-action";
import { FAQ } from "@/components/marketing/faq";
import { Features as NewFeatures } from "@/components/marketing/features/main";
import { FloatingElements } from "@/components/marketing/floating-icons";
import { Footer as NewFooter } from "@/components/marketing/footer";
import { Hero as NewHero } from "@/components/marketing/hero/main";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Navbar as NewNavbar } from "@/components/marketing/nav";
import { ProductShowcase } from "@/components/marketing/product";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function LandingPage() {
    const router = useRouter();
    useEffect(() => {
        router.prefetch("/studio");
    }, [router]);
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