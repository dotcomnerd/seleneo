"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  framerProps?: MotionProps;
  className?: string;
}

export function WordRotate({
  words,
  duration = 2500,
  framerProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current) return;
    const span = document?.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    const styles = window.getComputedStyle(containerRef.current);
    span.style.font = styles.font;
    document?.body.appendChild(span);
    let maxWidth = 0;
    words.forEach(word => {
      span.textContent = word;
      maxWidth = Math.max(maxWidth, span.offsetWidth);
    });
    document?.body.removeChild(span);
    setContainerWidth(maxWidth);
  }, [words]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div 
      ref={containerRef}
      className={cn("overflow-hidden py-2", className)}
      style={{ width: containerWidth ? `${containerWidth}px` : 'auto' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className="block whitespace-nowrap"
          {...framerProps}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}