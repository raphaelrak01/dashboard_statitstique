'use client'

import { FliiinkerData } from '@/types/database'
import { calculateFliiinkerStatistics, getTopFliiinkersByService, GlobalStats } from '@/lib/statisticsService'
import { TrendingUp, DollarSign, Target, Award, BarChart3, Users, Globe } from 'lucide-react'
import { useMemo } from 'react'

interface AdvancedStatisticsProps {
  fliiinkers: FliiinkerData[]
}

export default function AdvancedStatistics({ fliiinkers }: AdvancedStatisticsProps) {
  const stats = useMemo(() => calculateFliiinkerStatistics(fliiinkers), [fliiinkers])
  const topFliiinkers = useMemo(() => getTopFliiinkersByService(fliiinkers), [fliiinkers])

  if (!fliiinkers.length) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <p className="text-gray-500 text-center">Aucune donnée disponible pour les statistiques</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Prix moyen global</p>
              <p className="text-3xl font-bold">{stats.averagePriceGlobal}€</p>
              <p className="text-blue-200 text-xs">par heure</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Rayon moyen</p>
              <p className="text-3xl font-bold">{stats.averageRadiusGlobal / 1000}</p>
              <p className="text-green-200 text-xs">kilomètres</p>
            </div>
            <Target className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Services actifs</p>
              <p className="text-3xl font-bold">{stats.totalServices}</p>
              <p className="text-purple-200 text-xs">différents services</p>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Fliiinkers</p>
              <p className="text-3xl font-bold">{stats.totalFliiinkers}</p>
              <p className="text-orange-200 text-xs">prestataires actifs</p>
            </div>
            <Users className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Statistiques par service */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
          Statistiques par service
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Fliiinkers</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Prix moyen</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Prix max</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Prix min</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Rayon moyen</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Prix le plus élevé</th>
              </tr>
            </thead>
            <tbody>
              {stats.serviceStats.map((service, index) => (
                <tr key={service.serviceId} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-800">{service.serviceName}</div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {service.fliiinkerCount}
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-lg font-bold text-green-600">{service.averagePrice}€</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-lg font-bold text-red-600">{service.highestPrice}€</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-lg font-bold text-blue-600">{service.lowestPrice}€</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-md font-semibold text-purple-600">{(service.averageRadius / 1000).toFixed(1)}km</span>
                  </td>
                  <td className="py-4 px-4">
                    {service.highestPriceFliiinker && (
                      <div className="text-sm">
                        <div className="font-semibold text-gray-800">{service.highestPriceFliiinker.name}</div>
                        <div className="text-red-600 font-bold">{service.highestPriceFliiinker.price}€/h</div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 3 par service */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Award className="w-6 h-6 mr-3 text-yellow-600" />
          Top 3 des prix par service
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {topFliiinkers.slice(0, 9).map((serviceTop) => (
            <div key={serviceTop.serviceId} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 text-center">{serviceTop.serviceName}</h4>
              <div className="space-y-2">
                {serviceTop.topFliiinkers.map((fliiinker, index) => (
                  <div key={fliiinker.id} className={`flex justify-between items-center p-2 rounded ${
                    index === 0 ? 'bg-yellow-100 border border-yellow-300' :
                    index === 1 ? 'bg-gray-100 border border-gray-300' :
                    'bg-orange-100 border border-orange-300'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-500 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{fliiinker.name}</span>
                    </div>
                    <span className="font-bold text-green-600">{fliiinker.price}€</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Répartition des prix et rayons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Répartition des prix */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Répartition des prix
          </h3>
          <div className="space-y-3">
            {stats.priceRanges.map((range, index) => (
              <div key={range.range} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{range.range}</span>
                <div className="flex items-center space-x-3 flex-1 ml-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${range.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 min-w-[60px]">
                    {range.count} ({range.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition des rayons */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Répartition des rayons
          </h3>
          <div className="space-y-3">
            {stats.radiusRanges.map((range, index) => (
              <div key={range.range} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{range.range}</span>
                <div className="flex items-center space-x-3 flex-1 ml-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${range.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 min-w-[60px]">
                    {range.count} ({range.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 