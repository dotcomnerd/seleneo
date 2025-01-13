import { Palette, Share, Sparkles, Upload } from 'lucide-react';
import { Badge } from '../ui/badge';
import { TimelineStep } from './timeline-step';

const steps = [
    {
        icon: Upload,
        title: "Upload Your Screenshot",
        description: "Drag and drop your product screenshot or paste it directly from your clipboard. We support all major image formats.",
        imageUrl: "https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?q=80&w=2920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        icon: Palette,
        title: "Style Your Background",
        description: "Choose from our curated collection of gradients, patterns, and solid backgrounds. Customize colors, and add text to match your brand.",
        imageUrl: "https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=800&q=80"
    },
    {
        icon: Sparkles,
        title: "Add Effects & Frames",
        description: "Enhance your screenshot with shadows, reflections, and device frames. Perfect for showcasing your product.",
        imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80"
    },
    {
        icon: Share,
        title: "Export & Share",
        description: "Download in multiple formats or share directly to social media. Get your visuals ready for the world to see.",
        imageUrl: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

export function HowItWorks() {
    // TODO: Maybe stop hiding the overflow? hm.
    return (
        <section className="relative md:py-16 overflow-hidden" id='how-it-works'>
            <div className="container mx-auto px-4">
                <div className="flex flex-col text-center rounded-md p-4  gap-8 items-center">
                    <div>
                        <Badge className='py-1 rounded-2xl px-4 text-lg bg-primary/70'>Workflow</Badge>
                    </div>
                    <h2 className="text-3xl md:text-5xl tracking-tighter max-w-2xl font-regular text-center mb-12 m-auto">
                        In Just <span className="font-semibold text-primary"
                        >4</span>{" "}
                        Steps, You'll Have a Wonderful Visual Ready to Share
                    </h2>
                </div>
                {/* TODO: similar to other - perf <GradientBlobTwo/> */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {steps.map((step, index) => (
                        <TimelineStep
                            key={index}
                            {...step}
                            index={index}
                        />
                    ))}
                </div>
            </div>
            {/* <GradientBlobTwo/> */}
        </section>
    );
}