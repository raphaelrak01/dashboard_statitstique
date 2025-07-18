'use client'

import { FliiinkerData } from '@/types/database'
import { TrendingUp, Target, Euro, Award, BarChart3, Users } from 'lucide-react'

interface ServiceStatisticsProps {
  fliiinkers: FliiinkerData[]
}

interface ServiceStats {
  serviceId: number
  serviceName: string
  averagePrice: number
  averageRadius: number
  highestPrice: number
  highestPriceFliiinker: string
  totalFliiinkers: number
  activeFliiinkers: number
}

export default function ServiceStatistics({ fliiinkers }: ServiceStatisticsProps) {
  // Calculer les statistiques par service
  const calculateServiceStats = (): ServiceStats[] => {
    const serviceMap = new Map<number, {
      prices: number[]
      radii: number[]
      fliiinkers: { name: string, price: number, isActive: boolean }[]
      serviceName: string
    }>()

    // Collecter les données par service
    fliiinkers.forEach(fliiinker => {
      fliiinker.services.forEach(service => {
        const serviceDetail = fliiinker.serviceDetails.find(sd => sd.id === service.service_id)
        const serviceName = serviceDetail?.name || `Service #${service.service_id}`
        
        if (!serviceMap.has(service.service_id)) {
          serviceMap.set(service.service_id, {
            prices: [],
            radii: [],
            fliiinkers: [],
            serviceName
          })
        }

        const serviceData = serviceMap.get(service.service_id)!
        serviceData.prices.push(service.hourly_rate)
        serviceData.fliiinkers.push({
          name: `${fliiinker.profile.first_name} ${fliiinker.profile.last_name}`,
          price: service.hourly_rate,
          isActive: service.is_active
        })

        // Récupérer les rayons pour ce service
        const relatedRadii = fliiinker.addressLocations
          .filter(loc => loc.service_id === service.service_id)
          .map(loc => loc.radius_max)
        
        serviceData.radii.push(...relatedRadii)
      })
    })

    // Calculer les statistiques
    const stats: ServiceStats[] = []
    serviceMap.forEach((data, serviceId) => {
      const averagePrice = data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length
      const averageRadius = data.radii.length > 0 
        ? data.radii.reduce((sum, radius) => sum + radius, 0) / data.radii.length 
        : 0
      
      const highestPriceFliiinker = data.fliiinkers.reduce((highest, current) => 
        current.price > highest.price ? current : highest
      )

      stats.push({
        serviceId,
        serviceName: data.serviceName,
        averagePrice: Math.round(averagePrice * 100) / 100,
        averageRadius: Math.round(averageRadius * 100) / 100,
        highestPrice: highestPriceFliiinker.price,
        highestPriceFliiinker: highestPriceFliiinker.name,
        totalFliiinkers: data.fliiinkers.length,
        activeFliiinkers: data.fliiinkers.filter(f => f.isActive).length
      })
    })

    return stats.sort((a, b) => b.averagePrice - a.averagePrice)
  }

  const serviceStats = calculateServiceStats()

  // Statistiques globales
  const globalStats = {
    totalServices: serviceStats.length,
    globalAveragePrice: Math.round((serviceStats.reduce((sum, stat) => sum + stat.averagePrice, 0) / serviceStats.length) * 100) / 100,
    globalAverageRadius: Math.round((serviceStats.reduce((sum, stat) => sum + stat.averageRadius, 0) / serviceStats.length) * 100) / 100,
    totalActiveFliiinkers: serviceStats.reduce((sum, stat) => sum + stat.activeFliiinkers, 0),
    highestServicePrice: Math.max(...serviceStats.map(s => s.highestPrice))
  }

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2" />
          Statistiques Générales
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{globalStats.totalServices}</div>
            <div className="text-sm opacity-90">Services</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{globalStats.globalAveragePrice}€</div>
            <div className="text-sm opacity-90">Prix moyen global</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{globalStats.globalAverageRadius} km</div>
            <div className="text-sm opacity-90">Rayon moyen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{globalStats.totalActiveFliiinkers}</div>
            <div className="text-sm opacity-90">Fliiinkers actifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{globalStats.highestServicePrice}€</div>
            <div className="text-sm opacity-90">Prix max</div>
          </div>
        </div>
      </div>

      {/* Statistiques par service */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
          Statistiques par Service
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {serviceStats.map((stat) => (
            <div key={stat.serviceId} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 truncate" title={stat.serviceName}>
                {stat.serviceName}
              </h4>
              
              <div className="space-y-3">
                {/* Prix moyen */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Euro className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Prix moyen</span>
                  </div>
                  <span className="font-bold text-green-600">{stat.averagePrice}€/h</span>
                </div>

                {/* Rayon moyen */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Rayon moyen</span>
                  </div>
                  <span className="font-bold text-orange-600">{stat.averageRadius} km</span>
                </div>

                {/* Fliiinkers */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Actifs/Total</span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {stat.activeFliiinkers}/{stat.totalFliiinkers}
                  </span>
                </div>

                {/* Prix le plus élevé */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Prix le plus élevé</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold text-yellow-600">{stat.highestPrice}€/h</span>
                    <br />
                    <span className="truncate block" title={stat.highestPriceFliiinker}>
                      {stat.highestPriceFliiinker}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 services les plus chers */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-600" />
          Top 3 Services - Prix Moyens
        </h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          {serviceStats.slice(0, 3).map((stat, index) => (
            <div key={stat.serviceId} className="bg-white rounded-lg p-4 border-2 border-yellow-300 relative">
              {/* Médaille */}
              <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                index === 0 ? 'bg-yellow-500' : 
                index === 1 ? 'bg-gray-400' : 
                'bg-orange-500'
              }`}>
                {index + 1}
              </div>
              
              <h4 className="font-bold text-gray-800 mb-2 pr-6" title={stat.serviceName}>
                {stat.serviceName}
              </h4>
              
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stat.averagePrice}€/h</div>
                  <div className="text-xs text-gray-500">Prix moyen</div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Rayon: {stat.averageRadius}km</span>
                  <span className="text-blue-600">{stat.activeFliiinkers} actifs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 