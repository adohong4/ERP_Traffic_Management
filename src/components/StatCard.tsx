import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' | 'amber' | 'indigo' | 'pink' | 'emerald' | 'slate' | 'teal';
  variant?: 'default' | 'gradient' | 'outline';
  chartData?: any[];
  chartType?: 'line' | 'bar';
  delay?: number;
  illustration?: ReactNode;
  progress?: number;
  badge?: ReactNode;
}

const colorStyles = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    chart: '#3b82f6',
    light: 'bg-blue-100',
    ring: 'ring-blue-500/20'
  },
  green: {
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    text: 'text-green-600',
    chart: '#10b981',
    light: 'bg-green-100',
    ring: 'ring-green-500/20'
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    chart: '#a855f7',
    light: 'bg-purple-100',
    ring: 'ring-purple-500/20'
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    chart: '#f97316',
    light: 'bg-orange-100',
    ring: 'ring-orange-500/20'
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-600',
    chart: '#ef4444',
    light: 'bg-red-100',
    ring: 'ring-red-500/20'
  },
  cyan: {
    gradient: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    chart: '#06b6d4',
    light: 'bg-cyan-100',
    ring: 'ring-cyan-500/20'
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    chart: '#f59e0b',
    light: 'bg-amber-100',
    ring: 'ring-amber-500/20'
  },
  indigo: {
    gradient: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    chart: '#6366f1',
    light: 'bg-indigo-100',
    ring: 'ring-indigo-500/20'
  },
  pink: {
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    chart: '#ec4899',
    light: 'bg-pink-100',
    ring: 'ring-pink-500/20'
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    chart: '#10b981',
    light: 'bg-emerald-100',
    ring: 'ring-emerald-500/20'
  },
  slate: {
    gradient: 'from-slate-500 to-slate-600',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    chart: '#64748b',
    light: 'bg-slate-100',
    ring: 'ring-slate-500/20'
  },
  teal: {
    gradient: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    chart: '#14b8a6',
    light: 'bg-teal-100',
    ring: 'ring-teal-500/20'
  }
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  variant = 'default',
  chartData,
  chartType = 'line',
  delay = 0,
  illustration,
  progress,
  badge
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card 
        className={`
          h-full overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300
          ${variant === 'gradient' ? `bg-gradient-to-br ${styles.gradient} text-white` : ''}
          ${variant === 'outline' ? `border-2 border-${color}-200` : ''}
          ${variant === 'default' ? `ring-1 ${styles.ring}` : ''}
        `}
      >
        <CardContent className="p-6">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <p className={`text-sm font-medium ${variant === 'gradient' ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className={`text-3xl font-bold tracking-tight ${variant === 'gradient' ? 'text-white' : ''}`}>
                    {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
                  </h3>
                  {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      variant === 'gradient' 
                        ? 'text-white/90' 
                        : trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{Math.abs(trend.value)}%</span>
                    </div>
                  )}
                </div>
                {subtitle && (
                  <p className={`text-xs ${variant === 'gradient' ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Icon or Illustration */}
              {illustration ? (
                <div className="ml-4">{illustration}</div>
              ) : Icon ? (
                <div className={`
                  p-3 rounded-xl 
                  ${variant === 'gradient' ? 'bg-white/20' : styles.bg}
                `}>
                  <Icon className={`h-6 w-6 ${variant === 'gradient' ? 'text-white' : styles.text}`} />
                </div>
              ) : null}
            </div>

            {/* Badge */}
            {badge && (
              <div>{badge}</div>
            )}

            {/* Chart */}
            {chartData && chartData.length > 0 && (
              <div className="h-16 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={chartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={variant === 'gradient' ? '#ffffff' : styles.chart}
                        strokeWidth={2}
                        dot={false}
                        opacity={variant === 'gradient' ? 0.8 : 1}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <Bar
                        dataKey="value"
                        fill={variant === 'gradient' ? '#ffffff' : styles.chart}
                        radius={[4, 4, 0, 0]}
                        opacity={variant === 'gradient' ? 0.8 : 1}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}

            {/* Progress Bar */}
            {progress !== undefined && (
              <div className="space-y-1 mt-4">
                <div className="flex justify-between text-xs">
                  <span className={variant === 'gradient' ? 'text-white/70' : 'text-muted-foreground'}>
                    Tỷ lệ hoàn thành
                  </span>
                  <span className={variant === 'gradient' ? 'text-white font-medium' : 'font-medium'}>
                    {progress}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${variant === 'gradient' ? 'bg-white/20' : 'bg-gray-200'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: delay + 0.2 }}
                    className={`h-full rounded-full ${variant === 'gradient' ? 'bg-white' : `bg-gradient-to-r ${styles.gradient}`}`}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
