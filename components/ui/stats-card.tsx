import React, { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

export interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange' | string
  description?: string
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}

const iconColorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  red: 'bg-red-100 text-red-600',
  orange: 'bg-orange-100 text-orange-600',
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = 'blue',
  description,
  trend,
  className
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn("p-3 rounded-full", iconColorClasses[iconColor as keyof typeof iconColorClasses])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.value}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCardGrid({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {children}
    </div>
  )
}

