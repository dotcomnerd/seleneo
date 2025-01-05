import { Badge } from '@/components/ui/badge';
import { FadeIn } from '../hero/blur-fade';
import { FeatureGrid } from './grid';

export function Features() {
    return (
        <section id="features" className="relative container mx-auto px-4 pt-[5rem] mb-12">
            <FadeIn>
                <div className="flex flex-col text-center rounded-md gap-4 items-center">
                    <div>
                        <Badge className='py-1 rounded-2xl px-4 text-lg bg-primary/70'>Features</Badge>
                    </div>
                    <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-center mb-12 m-auto">
                        Turn Simple Screenshots into Stunning Visuals
                    </h2>
                </div>
            </FadeIn>
            <FeatureGrid />
        </section>
    );
}