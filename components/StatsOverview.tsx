'use client'

import { FliiinkerData } from '@/types/database'
import { Users, Target, DollarSign, MapPin, TrendingUp, Briefcase } from 'lucide-react'

interface StatsOverviewProps {
  stats: {
    total: number
    totalServices: number
    averagePrice: number
    averageRadius: number
    totalCities: number
    professionalRatio: number
  }
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      icon: Users,
      title: 'Profils Actifs',
      value: stats.total,
      isMain: true,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50/80 to-blue-100/80',
      borderColor: 'border-blue-200/50'
    },
    {
      icon: Briefcase,
      title: 'Services Totaux',
      value: stats.totalServices,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50/80 to-purple-100/80',
      borderColor: 'border-purple-200/50'
    },
    {
      icon: DollarSign,
      title: 'Prix Moyen',
      value: `${stats.averagePrice}€`,
      subtitle: 'par heure',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50/80 to-emerald-100/80',
      borderColor: 'border-emerald-200/50'
    },
    {
      icon: Target,
      title: 'Rayon Moyen',
      value: Math.round(stats.averageRadius / 1000),
      subtitle: 'kilomètres',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50/80 to-orange-100/80',
      borderColor: 'border-orange-200/50'
    },
    {
      icon: MapPin,
      title: 'Villes Couvertes',
      value: stats.totalCities,
      gradient: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-50/80 to-pink-100/80',
      borderColor: 'border-pink-200/50'
    },
    {
      icon: TrendingUp,
      title: 'Professionnels',
      value: `${stats.professionalRatio}%`,
      subtitle: 'du total',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50/80 to-indigo-100/80',
      borderColor: 'border-indigo-200/50'
    }
  ]

  return (
    <div>
      {/* Header Dashboard */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
          Métriques Principales
        </h2>
        <p className="text-gray-500 font-light max-w-2xl mx-auto">
          Vue d'ensemble en temps réel de votre écosystème Fliiinker
        </p>
      </div>

      {/* Grille de statistiques premium */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div 
              key={index} 
              className={`group text-center animate-fade-in hover:scale-105 transition-all duration-500 relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-3xl p-6 border-2 ${stat.borderColor} backdrop-blur-sm`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Icône premium */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                  stat.isMain 
                    ? 'bg-apple-intelligence group-hover:scale-110 group-hover:shadow-xl' 
                    : `bg-gradient-to-r ${stat.gradient} group-hover:scale-110 group-hover:shadow-xl`
                }`}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                
                {/* Titre avec style premium */}
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 opacity-80">
                  {stat.title}
                </p>
                
                {/* Valeur principale */}
                <div className="space-y-2">
                  <p className={`text-4xl font-light transition-colors duration-300 ${
                    stat.isMain ? 'text-gray-900' : 'text-gray-800'
                  } group-hover:text-gray-900`}>
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500 font-medium bg-white/60 rounded-full px-3 py-1 border border-gray-200/50">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Bordure animée */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            </div>
          )
        })}
      </div>

      {/* Indicateur global de performance */}
      {/* <div className="mt-12 bg-white/80 backdrop-blur-lg border-2 border-gray-200/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-1">
                Performance Globale
              </h4>
              <p className="text-gray-600 font-light">
                Écosystème actif et performant
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-3xl font-light text-emerald-600 mb-1">98%</div>
              <div className="text-xs text-emerald-600 font-bold uppercase tracking-wide">Taux de satisfaction</div>
            </div>
            <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
          </div>
        </div>
      </div> */}
    </div>
  )
} 