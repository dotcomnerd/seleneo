"use client";

import { useInView } from '@/hooks/use-in-view';
import { LucideIcon } from 'lucide-react';
import { type RefObject } from 'react';

interface TimelineStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  imageUrl: string;
  index: number;
}

export function TimelineStep({ icon: Icon, title, description, imageUrl, index }: TimelineStepProps) {
  const [ref, isInView] = useInView({ threshold: 0, once: true });

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={`group relative flex gap-8 items-center transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {index !== 0 && (
        <div className="absolute -top-24 left-6 w-0.5 h-24 bg-gradient-to-b from-transparent via-indigo-200 dark:via-indigo-800 to-indigo-300 dark:to-indigo-700" />
      )}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      <div className="flex-1 bg-white p-6 dark:bg-background/20 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl transition-shadow cursor-pointer group-hover:-translate-y-1 duration-300">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </div>
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20" />
            <img
              src={imageUrl}
              alt={title}
              loading="eager"
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}