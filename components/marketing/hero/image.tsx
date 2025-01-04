import { AspectRatio } from '@/components/ui/aspect-ratio';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

const getRandomColor = () => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500'
  ];
  
  const textColors = [
    'text-blue-900',
    'text-green-900',
    'text-purple-900',
    'text-pink-900',
    'text-yellow-900',
    'text-red-900',
    'text-indigo-900',
    'text-orange-900',
    'text-teal-900',
    'text-cyan-900'
  ];

  const bgToTextMap: Record<string, string> = {
    'bg-blue-500': 'text-blue-900',
    'bg-green-500': 'text-green-900',
    'bg-purple-500': 'text-purple-900',
    'bg-pink-500': 'text-pink-900',
    'bg-yellow-500': 'text-yellow-900',
    'bg-red-500': 'text-red-900',
    'bg-indigo-500': 'text-indigo-900',
    'bg-orange-500': 'text-orange-900',
    'bg-teal-500': 'text-teal-900',
    'bg-cyan-500': 'text-cyan-900'
  };
  
  const randomBgColor = colors[Math.floor(Math.random() * colors.length)];
  const randomTextColor = bgToTextMap[randomBgColor];

  return {
    background: randomBgColor,
    text: randomTextColor
  };
};

const getRandomVelocity = (currentVel: number) => {
  // Random velocity between 0.7 and 1.3 times the current velocity
  const multiplier = 0.7 + Math.random() * 0.6;
  return currentVel * multiplier;
};

interface BouncingTextProps {
  speed?: number;
}

function BouncingText({ speed = 0.2 }: BouncingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [colors, setColors] = useState(getRandomColor());
  
  useEffect(() => {
    let animationFrameId: number;
    let currentPos = { x: 0, y: 0 };
    let currentVel = { x: speed, y: speed };
    let bounds = { width: 0, height: 0 };
    let textSize = { width: 0, height: 0 };
    let lastCollision = 0;
    
    const updateBounds = () => {
      if (containerRef.current && textRef.current) {
        const containerBounds = containerRef.current.getBoundingClientRect();
        const textBounds = textRef.current.getBoundingClientRect();
        bounds = {
          width: containerBounds.width,
          height: containerBounds.height
        };
        textSize = {
          width: textBounds.width,
          height: textBounds.height
        };
        if (currentPos.x > bounds.width - textSize.width) currentPos.x = bounds.width - textSize.width;
        if (currentPos.y > bounds.height - textSize.height) currentPos.y = bounds.height - textSize.height;
      }
    };

    updateBounds();
    
    const resizeObserver = new ResizeObserver(updateBounds);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const handleCollision = () => {
      const now = Date.now();
      if (now - lastCollision > 50) {
        setColors(getRandomColor());
        // Randomize velocities on collision
        currentVel.x = getRandomVelocity(currentVel.x);
        currentVel.y = getRandomVelocity(currentVel.y);
        lastCollision = now;
      }
    };

    const animate = () => {
      if (!bounds.width || !bounds.height) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      currentPos.x += currentVel.x;
      currentPos.y += currentVel.y;
      
      const hitVertical = currentPos.x <= 0 || currentPos.x >= bounds.width - textSize.width;
      const hitHorizontal = currentPos.y <= 0 || currentPos.y >= bounds.height - textSize.height;
      
      if (hitVertical) {
        currentVel.x *= -1;
        currentPos.x = Math.max(0, Math.min(currentPos.x, bounds.width - textSize.width));
        handleCollision();
      }
      if (hitHorizontal) {
        currentVel.y *= -1;
        currentPos.y = Math.max(0, Math.min(currentPos.y, bounds.height - textSize.height));
        handleCollision();
      }
      
      controls.set({
        x: currentPos.x,
        y: currentPos.y
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
    };
  }, [speed]);

  return (
    <div ref={containerRef} className="absolute inset-0 hidden md:block">
      <motion.div
        ref={textRef}
        animate={controls}
        initial={{ x: 0, y: 0 }}
        className={`absolute whitespace-nowrap ${colors.background} backdrop-blur-sm px-4 py-2 rounded-lg transition-colors duration-200 bg-opacity-80`}
      >
        <span className={`${colors.text} transition-colors duration-200`}>
          preview coming soon. let's bounce around in the meantime...
        </span>
      </motion.div>
    </div>
  );
}

export function HeroImage() {
  return (
    <div className="md:block relative">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 dark:opacity-50 opacity-30 dark:blur-2xl blur-3xl" />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 mx-4">
            <div className="w-full h-6 rounded bg-gray-100 dark:bg-gray-800 flex flex-row items-start justify-center">
              <div className="w-4 h-4 text-gray-400">🔒</div>
              <div>
                <span className="text-sm text-gray-400 ml-1">coming-soon.io</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <AspectRatio ratio={16/9} />
          <BouncingText speed={1.54} />
        </div>
      </div>
    </div>
  );
}