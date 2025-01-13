import React from 'react';
import { LucideIcon } from 'lucide-react';
import { FadeIn } from '../hero/blur-fade';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <FadeIn delay={100 * (index + 1)}>
      <div className="group bg-white dark:bg-background/20 backdrop-blur-2xl p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
        <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </FadeIn>
  );
}

interface AlternateFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureCardAlternate = ({ title, description, icon }: AlternateFeatureCardProps) => {
    return (
        <div className="flex flex-col gap-5 border border-white border-opacity-10 p-4 bg-white dark:bg-background/20 rounded-xl shadow-xl border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl w-full max-w-[15rem] min-h-[15rem] justify-center">
            <div className="p-4 bg-primary w-fit flex items-center justify-center rounded-md border-t border-t-white border-opacity-10 border-r border-r-white">
                {icon}
            </div>
            <div>
                <h2 className="text-xl whitespace-nowrap">{title}</h2>
                <p className="text-[14px] opacity-60">{description}</p>
            </div>
        </div>
    );
};