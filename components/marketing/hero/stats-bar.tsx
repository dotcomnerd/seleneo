import React from 'react';
import { Users, Star, Award, Timer, LucideIcon, Settings, Settings2, Paintbrush } from 'lucide-react';

type StatItem = {
  icon: LucideIcon | string;
  value: string;
  label: string;
};

const stats: StatItem[] = [
  { icon: Settings2, value: '60+', label: 'Customization Options' },
  { icon: "🙅🏿‍♂️", value: '0', label: 'Design Skills Required' },
  { icon: Paintbrush, value: '1,000,000+', label: 'Possibilities' },
];

const IconRenderer = ({ icon }: { icon: StatItem['icon'] }) => {
  if (typeof icon === 'string') {
    return <span className="text-2xl">{icon}</span>;
  }
  
  const IconComponent = icon;
  return <IconComponent className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />;
};

export function StatsBar() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white dark:bg-background/20 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
          {stats.map(({ icon, value, label }) => (
            <div key={label} className="p-6 text-center">
              <div className="flex justify-center mb-2">
                <IconRenderer icon={icon} />
              </div>
              <div className="font-bold text-2xl text-gray-900 dark:text-white mb-1">{value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}