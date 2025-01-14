import { Camera, Grid, Keyboard, Paintbrush, PenTool, Save, Share, Wand2 } from 'lucide-react';
import { FeatureCard, FeatureCardAlternate } from './card';

const features = [
 {
   icon: <Camera className="w-6 h-6 text-white" />,
   title: "Upload Screenshots",
   description: "Bring your screenshots to life by adding device frames, shadows, and text super easily."
 },
 {
   icon: <Paintbrush className="w-6 h-6 text-white" />,
    title: "Custom Styling",
    description: "Customize your visuals with a wide range of gradients, shadows, and text styles to choose from."
 },
 {
   icon: <Wand2 className="w-6 h-6 text-white" />,
   title: "Image Adaptivity",
   description: "Generate adaptive gradients, shadows, and backgrounds based on the colors of your uploaded images."
 },
 {
   icon: <Keyboard className="w-6 h-6 text-white" />,
   title: "Keyboard Shortcuts",
   description: "Speed up your workflow with a wide range of keyboard shortcuts for every tool and action."
 },
 {
   icon: <PenTool className="w-6 h-6 text-white" />,
   title: "Advanced Tools",
   description: "Fine-tune every detail from 3D transformations to justified positioning tools, and more."
 },
 {
   icon: <Grid className="w-6 h-6 text-white" />,
   title: "Community Hub",
   description: "Share your creations with other Seleneo users on the community hub, and get inspired by others."
},
{
    icon: <Save className="w-6 h-6 text-white" />,
    title: "Save & Export",
    description: "Save your creations to the cloud, or export them as PNG, JPEG, WEBP, or SVG files."
},
];

export function FeatureGrid() {
 return (
  <div className="flex flex-wrap gap-4 space-y-4 md:space-y-0 justify-center justify-items-center max-w-5xl mx-auto">
    {features.map((feature) => (
        <FeatureCardAlternate
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
        />
    ))}
</div>
 );
}