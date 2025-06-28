import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: 'purple' | 'blue' | 'emerald' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorMap = {
  purple: {
    bg: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
    icon: 'text-purple-600 dark:text-purple-400',
    value: 'text-purple-900 dark:text-purple-100',
    subtitle: 'text-purple-600 dark:text-purple-400'
  },
  blue: {
    bg: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
    icon: 'text-blue-600 dark:text-blue-400',
    value: 'text-blue-900 dark:text-blue-100',
    subtitle: 'text-blue-600 dark:text-blue-400'
  },
  emerald: {
    bg: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30',
    icon: 'text-emerald-600 dark:text-emerald-400',
    value: 'text-emerald-900 dark:text-emerald-100',
    subtitle: 'text-emerald-600 dark:text-emerald-400'
  },
  orange: {
    bg: 'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30',
    icon: 'text-orange-600 dark:text-orange-400',
    value: 'text-orange-900 dark:text-orange-100',
    subtitle: 'text-orange-600 dark:text-orange-400'
  }
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color, trend }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.1, ease: "easeOut" }
      }}
      transition={{ duration: 0.1 }}
      className={`bg-gradient-to-br ${colors.bg} p-6 rounded-2xl border border-opacity-20 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-100 cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 ${colors.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</h3>
        <p className={`text-3xl font-bold ${colors.value} mb-1`}>{value}</p>
        <p className={`text-sm ${colors.subtitle}`}>{subtitle}</p>
      </div>
    </motion.div>
  );
}