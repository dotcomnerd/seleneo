import React from 'react';
import { Camera, Paintbrush, Wand2, Share, PenTool, Grid } from 'lucide-react';
import { FeatureCardAlernate } from './card';

const features = [
 {
   icon: <Camera className="w-6 h-6 text-white" />,
   title: "Upload Screenshots",
   description: "Bring your screenshots to turn into fancy visuals with customizable layouts and styles."
 },
 {
   icon: <Paintbrush className="w-6 h-6 text-white" />,
   title: "Preset Library",
   description: "Access a wide variety of pre-designed templates or create and save your own custom presets."
 },
 {
   icon: <Wand2 className="w-6 h-6 text-white" />,
   title: "AI Enhancements",
   description: "Leverage advanced AI tools to auto-enhance your screenshots, ensuring top-quality results effortlessly."
 },
 {
   icon: <Share className="w-6 h-6 text-white" />,
   title: "Quick Share",
   description: "Directly share enhanced visuals to social platforms, download, or copy to clipboard in one click."
 },
 {
   icon: <PenTool className="w-6 h-6 text-white" />,
   title: "Advanced Tools",
   description: "Fine-tune every detail from 3D transformations to mock device frames with precision controls."
 },
 {
   icon: <Grid className="w-6 h-6 text-white" />,
   title: "Community Hub",
   description: "Share your creations with other Seleneo users or discover and use community-featured presets."
 }
];

export function FeatureGrid() {
 return (
   <div className="flex flex-wrap justify-center items-start gap-4 p-4">
     {features.map((feature) => (
       <FeatureCardAlernate
         key={feature.title}
         icon={feature.icon}
         title={feature.title}
         description={feature.description}
       />
     ))}
   </div>
 );
}