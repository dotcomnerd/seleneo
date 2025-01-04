import React from 'react';
import { BlurFade, FadeIn } from '../hero/blur-fade';
import { FeatureGrid } from './grid';

export function Features() {
  return (
    <section id="features" className="relative container mx-auto px-4 py-24">
      <FadeIn>
        <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-center mb-12 m-auto">
          Turn Simple Screenshots into Stunning Visuals
        </h2>
      </FadeIn>
      <BlurFade delay={0.35}>
        <FeatureGrid />
      </BlurFade>
    </section>
  );
}