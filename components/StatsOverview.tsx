'use client'

import { Users, CheckCircle, XCircle, Clock } from 'lucide-react'

interface StatsOverviewProps {
  stats: {
    total: number
    approved: number
    rejected: number
    pending: number
  }
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const { total, approved, rejected, pending } = stats

  const getProgressPercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0
  }

  const statCards = [
    {
      title: 'Total Fliiinkers',
      value: total,
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      title: 'Approuvés',
      value: approved,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      percentage: getProgressPercentage(approved)
    },
    {
      title: 'Rejetés',
      value: rejected,
      icon: XCircle,
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
      borderColor: 'border-danger-200',
      percentage: getProgressPercentage(rejected)
    },
    {
      title: 'En attente',
      value: pending,
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      percentage: getProgressPercentage(pending)
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-6 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                {stat.percentage !== undefined && (
                  <p className="text-sm text-gray-500 mt-1">
                    {stat.percentage.toFixed(1)}% du total
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
            
            {/* Barre de progression pour les décisions */}
            {stat.percentage !== undefined && total > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stat.title === 'Approuvés' ? 'bg-success-500' :
                      stat.title === 'Rejetés' ? 'bg-danger-500' :
                      'bg-warning-500'
                    }`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
} 