"use client";

import React from 'react';
import { useInView } from '@/hooks/use-in-view';
import { StatsBar } from './hero/stats-bar';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const screenshots = [
 {
   url: "/yt-thumbnail.png",
   title: "YouTube Thumbnails",
   description: "Build both simple and complex YouTube thumbnails possibly using our multi-format imports, 3D transformations, and object layering."
 },
 {
  url: "/blog.png",
  title: "Blog Post Graphics",
  description: "Design blog covers, images, and diagrams in minutes with Seleneo's intuitive tools—perfect for enhancing your content.",
  aspect: "aspect-video",
},
 {
   url: "/twitter.png",
   title: "Website Open Graph and SEO Content",
   description: "Use Seleneo's built-in canvas and browser frames to show off your services, product, or portfolio easily.",
   aspect: "aspect-video"
 },
 {
  url: "/instagram.png",
  title: "Instagram Posts",
  description: "Design Instagram-perfect posts in Seleneo's square frame. No resizing or cropping—just great content ready to share.",
  aspect: "aspect-square",
},
];

export function ProductShowcase() {
 const [ref, isInView] = useInView({ threshold: 0.2, once: true });
 const [selected, setSelected] = React.useState(0);

 return (
   <section className="py-12 overflow-hidden bg-background" ref={ref}>
     <div className="container mx-auto px-4">
       <h2 className="text-3xl md:text-5xl tracking-tighter max-w-2xl font-regular text-center mb-12 m-auto">
         With Seleneo, your advanced workflows become easy
       </h2>
       <StatsBar />

       <div className="grid lg:grid-cols-2 gap-8 mt-16">
         <div className="flex flex-col gap-4">
           {screenshots.map((item, index) => (
             <motion.div
               key={index}
               className={`p-6 rounded-xl cursor-pointer transition-all backdrop-blur-sm ${
                 selected === index
                   ? 'bg-primary/10 shadow-lg'
                   : 'hover:bg-muted/50'
               }`}
               onClick={() => setSelected(index)}
               initial={false}
               animate={{
                 y: isInView ? 0 : 20,
                 opacity: isInView ? 1 : 0
               }}
               transition={{ delay: index * 0.1 }}
             >
               <div className="flex items-center gap-4">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md ${
                   selected === index
                     ? 'bg-primary text-primary-foreground'
                     : 'bg-muted/80 text-muted-foreground'
                 }`}>
                   {index + 1}
                 </div>
                 <div>
                   <h3 className="font-semibold text-lg">{item.title}</h3>
                   <p className="text-muted-foreground">{item.description}</p>
                 </div>
               </div>
             </motion.div>
           ))}
         </div>

         <div className="h-[600px] relative rounded-xl border border-border/10 overflow-hidden backdrop-blur-md bg-background/50">
           <AnimatePresence mode="wait">
             <motion.div
               key={selected}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.05 }}
               transition={{ duration: 0.3 }}
               className="absolute inset-0 p-4"
             >
               <div className="w-full h-full relative rounded-lg overflow-hidden bg-gradient-to-t from-background/80 to-muted/50 backdrop-blur-sm">
                   <div className={`w-full ${screenshots[selected].aspect} flex rounded-lg overflow-hidden shadow-2xl`}>
                     <img
                       loading="lazy"
                       src={screenshots[selected].url}
                       alt={screenshots[selected].title}
                       className="w-full h-full object-cover"
                     />
                 </div>
               </div>
             </motion.div>
           </AnimatePresence>
         </div>
       </div>
     </div>
   </section>
 );
}