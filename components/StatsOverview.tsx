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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {/* Total Fliiinkers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Users className="h-8 w-8 text-primary-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Fliiinkers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Total Services */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Services Totaux</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
          </div>
        </div>
      </div>

      {/* Prix Moyen */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Prix Moyen</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averagePrice}€</p>
            <p className="text-xs text-gray-500">par heure</p>
          </div>
        </div>
      </div>

      {/* Rayon Moyen */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Target className="h-8 w-8 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Rayon Moyen</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageRadius / 1000}</p>
            <p className="text-xs text-gray-500">kilomètres</p>
          </div>
        </div>
      </div>

      {/* Villes Couvertes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Villes Couvertes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCities}</p>
          </div>
        </div>
      </div>

      {/* Ratio Professionnels */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Professionnels</p>
            <p className="text-2xl font-bold text-gray-900">{stats.professionalRatio}%</p>
            <p className="text-xs text-gray-500">du total</p>
          </div>
        </div>
      </div>
    </div>
  )
} 