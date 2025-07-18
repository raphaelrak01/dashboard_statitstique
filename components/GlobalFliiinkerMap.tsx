'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FliiinkerData } from '@/types/database'
import { MapPin, Users, Target, Info, Eye, EyeOff, Award, BarChart3 } from 'lucide-react'

// Fix pour les icônes Leaflet dans Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface GlobalFliiinkerMapProps {
  fliiinkers: FliiinkerData[]
  height?: string
}

interface ServiceZone {
  lat: number
  lng: number
  radius: number
  serviceName: string
  fliiinkerName: string
  hourlyRate: number
  serviceId: number
  fliiinkerId: string
  city: string
}

interface DensityPoint {
  lat: number
  lng: number
  density: number
  services: Set<string>
  fliiinkers: Set<string>
  avgPrice: number
  totalZones: number
}

interface CityStats {
  city: string
  fliiinkersCount: number
  servicesCount: number
  avgPrice: number
  avgRadius: number
  services: {
    [serviceName: string]: {
      count: number
      avgPrice: number
      avgRadius: number
    }
  }
}

export default function GlobalFliiinkerMap({ fliiinkers, height = '600px' }: GlobalFliiinkerMapProps) {
  const [showDensity, setShowDensity] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  const [selectedService, setSelectedService] = useState<number | null>(null)

  if (!fliiinkers.length) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center`} style={{ height }}>
        <p className="text-gray-500">Aucune donnée disponible pour la carte</p>
      </div>
    )
  }

  // Collecter toutes les zones de service avec les villes
  const serviceZones: ServiceZone[] = []
  const fliiinkerLocations: { lat: number, lng: number, fliiinker: FliiinkerData, city: string }[] = []

  fliiinkers.forEach(fliiinker => {
    fliiinker.addresses.forEach(address => {
      // Ajouter la position du fliiinker avec la ville
      fliiinkerLocations.push({
        lat: address.latitude,
        lng: address.longitude,
        fliiinker,
        city: address.city || 'Ville inconnue'
      })

      // Ajouter les zones de service avec la ville
      fliiinker.addressLocations
        .filter(location => location.address_id === address.id)
        .forEach(location => {
          const serviceName = fliiinker.serviceDetails.find(sd => sd.id === location.service_id)?.name || `Service #${location.service_id}`
          
          serviceZones.push({
            lat: address.latitude,
            lng: address.longitude,
            radius: location.radius_max, // Utiliser directement le rayon en km
            serviceName,
            fliiinkerName: `${fliiinker.profile.first_name} ${fliiinker.profile.last_name}`,
            hourlyRate: location.hourly_rate,
            serviceId: location.service_id,
            fliiinkerId: fliiinker.profile.id,
            city: address.city || 'Ville inconnue'
          })
        })
    })
  })

  // Calculer le centre de la carte
  const avgLat = fliiinkerLocations.reduce((sum, loc) => sum + loc.lat, 0) / fliiinkerLocations.length
  const avgLng = fliiinkerLocations.reduce((sum, loc) => sum + loc.lng, 0) / fliiinkerLocations.length
  const center: [number, number] = [avgLat, avgLng]

  // Obtenir les services uniques
  const uniqueServices = Array.from(new Set(serviceZones.map(zone => zone.serviceId)))
    .map(serviceId => {
      const zone = serviceZones.find(z => z.serviceId === serviceId)
      return { id: serviceId, name: zone?.serviceName || `Service #${serviceId}` }
    })

  // Filtrer les zones selon le service sélectionné
  const filteredZones = selectedService 
    ? serviceZones.filter(zone => zone.serviceId === selectedService)
    : serviceZones

  // Calculer les statistiques par ville
  const calculateCityStats = (): CityStats[] => {
    const cityMap = new Map<string, CityStats>()

    serviceZones.forEach(zone => {
      if (!cityMap.has(zone.city)) {
        cityMap.set(zone.city, {
          city: zone.city,
          fliiinkersCount: 0,
          servicesCount: 0,
          avgPrice: 0,
          avgRadius: 0,
          services: {}
        })
      }

      const cityData = cityMap.get(zone.city)!
      
      // Ajouter le service s'il n'existe pas
      if (!cityData.services[zone.serviceName]) {
        cityData.services[zone.serviceName] = {
          count: 0,
          avgPrice: 0,
          avgRadius: 0
        }
      }

      const serviceData = cityData.services[zone.serviceName]
      
      // Mettre à jour les données du service
      serviceData.avgPrice = (serviceData.avgPrice * serviceData.count + zone.hourlyRate) / (serviceData.count + 1)
      serviceData.avgRadius = (serviceData.avgRadius * serviceData.count + zone.radius) / (serviceData.count + 1)
      serviceData.count += 1
    })

    // Calculer les moyennes globales par ville
    cityMap.forEach((cityData, cityName) => {
      const fliiinkers = new Set(serviceZones.filter(z => z.city === cityName).map(z => z.fliiinkerId))
      cityData.fliiinkersCount = fliiinkers.size
      cityData.servicesCount = Object.keys(cityData.services).length
      
      const allPrices = serviceZones.filter(z => z.city === cityName).map(z => z.hourlyRate)
      const allRadii = serviceZones.filter(z => z.city === cityName).map(z => z.radius)
      
      cityData.avgPrice = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
      cityData.avgRadius = allRadii.reduce((sum, radius) => sum + radius, 0) / allRadii.length
    })

    return Array.from(cityMap.values()).sort((a, b) => b.fliiinkersCount - a.fliiinkersCount)
  }

  // Calculer les statistiques de rayons
  const calculateRadiusStats = () => {
    const allRadii = serviceZones.map(zone => ({
      radius: zone.radius,
      fliiinkerName: zone.fliiinkerName,
      serviceName: zone.serviceName,
      city: zone.city
    }))

    const avgRadius = allRadii.reduce((sum, item) => sum + item.radius, 0) / allRadii.length

    const sortedByRadius = [...allRadii].sort((a, b) => b.radius - a.radius)
    const topLargest = sortedByRadius.slice(0, 3)
    const topSmallest = sortedByRadius.slice(-3).reverse()

    return {
      avgRadius: Math.round(avgRadius * 100) / 100,
      topLargest,
      topSmallest,
      totalZones: allRadii.length
    }
  }

  // Calculer la distance entre deux points (formule de Haversine simplifiée)
  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return 6371 * c // Distance en km
  }

  // Algorithme optimisé pour la heatmap avec rayons corrects
  const calculateOptimizedDensityMap = (): DensityPoint[] => {
    const densityPoints: DensityPoint[] = []
    const processedZones = new Set<string>()
    
    // Limiter le nombre de calculs pour éviter les plantages
    const maxCalculations = 100
    let calculationCount = 0

    filteredZones.forEach((zone, index) => {
      if (calculationCount >= maxCalculations) return
      
      const zoneKey = `${zone.lat.toFixed(3)}-${zone.lng.toFixed(3)}`
      if (processedZones.has(zoneKey)) return
      
      // Compter les zones qui se chevauchent en utilisant les vrais rayons
      const nearbyZones = filteredZones.filter(otherZone => {
        if (otherZone === zone) return false
        const distance = getDistance(zone.lat, zone.lng, otherZone.lat, otherZone.lng)
        // Chevauchement si la distance est inférieure à la somme des rayons
        return distance <= (zone.radius + otherZone.radius)
      })

      // Si il y a chevauchement, créer un point de densité
      if (nearbyZones.length > 0) {
        const allZones = [zone, ...nearbyZones]
        const services = new Set(allZones.map(z => z.serviceName))
        const fliiinkers = new Set(allZones.map(z => z.fliiinkerName))
        const avgPrice = allZones.reduce((sum, z) => sum + z.hourlyRate, 0) / allZones.length

        densityPoints.push({
          lat: zone.lat,
          lng: zone.lng,
          density: allZones.length,
          services,
          fliiinkers,
          avgPrice,
          totalZones: allZones.length
        })

        processedZones.add(zoneKey)
        calculationCount++
      }
    })

    return densityPoints
  }

  // Fonction pour obtenir la couleur selon la densité
  const getDensityColor = (density: number): { color: string, opacity: number } => {
    // Échelle de couleur du bleu (faible) au rouge (forte)
    if (density <= 2) {
      return { color: '#3b82f6', opacity: 0.4 } // Bleu
    } else if (density <= 4) {
      return { color: '#8b5cf6', opacity: 0.5 } // Violet
    } else if (density <= 6) {
      return { color: '#f59e0b', opacity: 0.6 } // Orange
    } else if (density <= 8) {
      return { color: '#ef4444', opacity: 0.7 } // Rouge
    } else {
      return { color: '#dc2626', opacity: 0.8 } // Rouge foncé
    }
  }

  // Calculer toutes les statistiques
  const densityPoints = showDensity ? calculateOptimizedDensityMap() : []
  const cityStats = calculateCityStats()
  const radiusStats = calculateRadiusStats()

  return (
    <div className="space-y-4">
      {/* Contrôles de la carte */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Carte globale des Fliiinkers
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{fliiinkers.length} fliiinkers</span>
              <Target className="w-4 h-4 ml-2" />
              <span>{serviceZones.length} zones de service</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filtre par service */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Service :</label>
              <select
                value={selectedService || ''}
                onChange={(e) => setSelectedService(e.target.value ? Number(e.target.value) : null)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les services</option>
                {uniqueServices.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>

            {/* Toggle heatmap */}
            <button
              onClick={() => setShowDensity(!showDensity)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                showDensity 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showDensity ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Heatmap</span>
            </button>

            {/* Toggle marqueurs */}
            <button
              onClick={() => setShowMarkers(!showMarkers)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                showMarkers 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showMarkers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Marqueurs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Légende de la heatmap */}
      {/* <div className="bg-gradient-to-r from-blue-50 to-red-100 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start space-x-6">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Heatmap de densité :</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full opacity-40"></div>
              <span className="text-blue-700">2 zones</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full opacity-50"></div>
              <span className="text-purple-700">3-4 zones</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full opacity-60"></div>
              <span className="text-orange-700">5-6 zones</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full opacity-70"></div>
              <span className="text-red-700">7-8 zones</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full opacity-80"></div>
              <span className="text-red-800">9+ zones</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Carte */}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg" style={{ height }}>
        <MapContainer
          center={center}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marqueurs des fliiinkers */}
          {showMarkers && fliiinkerLocations.map((location, index) => (
            <Marker 
              key={`${location.fliiinker.profile.id}-${index}`}
              position={[location.lat, location.lng]}
            >
              <Popup>
                <div className="p-3 min-w-[200px]">
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={location.fliiinker.profile.avatar || `https://ui-avatars.com/api/?name=${location.fliiinker.profile.first_name}+${location.fliiinker.profile.last_name}&background=3b82f6&color=fff`}
                      alt={`${location.fliiinker.profile.first_name} ${location.fliiinker.profile.last_name}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {location.fliiinker.profile.first_name} {location.fliiinker.profile.last_name}
                      </h4>
                      <p className="text-xs text-gray-600">{location.city}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm"><strong>Services:</strong> {location.fliiinker.services.length}</p>
                    <p className="text-sm"><strong>Type:</strong> {location.fliiinker.fliiinkerProfile?.is_pro ? 'Pro' : 'Particulier'}</p>
                    <p className="text-sm"><strong>Statut:</strong> {
                      location.fliiinker.fliiinkerProfile?.is_validated ? '✅ Validé' : '⏳ En attente'
                    }</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Zones de service individuelles avec rayons corrects */}
          {showDensity && filteredZones.map((zone, index) => (
            <Circle
              key={`zone-${zone.fliiinkerId}-${zone.serviceId}-${index}`}
              center={[zone.lat, zone.lng]}
              radius={zone.radius} // Convertir km en mètres pour Leaflet
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                opacity: 0.3,
                weight: 1
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold text-gray-800">{zone.serviceName}</h4>
                  <p className="text-sm text-gray-600">Par: {zone.fliiinkerName}</p>
                  <div className="mt-2 space-y-1 text-xs">
                    <p><strong>Ville:</strong> {zone.city}</p>
                    <p><strong>Rayon:</strong> {zone.radius} km</p>
                    <p><strong>Tarif:</strong> {zone.hourlyRate}€/h</p>
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Points de densité pour les chevauchements */}
          {densityPoints.map((point, index) => {
            const style = getDensityColor(point.density)
            
            return (
              <Circle
                key={`density-${index}`}
                center={[point.lat, point.lng]}
                radius={300}
                pathOptions={{
                  color: style.color,
                  fillColor: style.color,
                  fillOpacity: style.opacity,
                  opacity: 0.9,
                  weight: 3
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-gray-800">Zone de chevauchement</h4>
                    <div className="mt-2 space-y-1 text-xs">
                      <p><strong>Densité:</strong> {point.density} zones</p>
                      <p><strong>Services:</strong> {Array.from(point.services).join(', ')}</p>
                      <p><strong>Prix moyen:</strong> {point.avgPrice.toFixed(0)}€/h</p>
                      <p><strong>Fliiinkers:</strong> {point.fliiinkers.size}</p>
                    </div>
                  </div>
                </Popup>
              </Circle>
            )
          })}
        </MapContainer>
      </div>

      {/* Statistiques avancées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Statistiques des rayons */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Statistiques des Rayons
          </h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium">Rayon moyen global</p>
              <p className="text-2xl font-bold text-blue-800">{radiusStats.avgRadius / 1000} km</p>
              <p className="text-xs text-blue-600">Sur {radiusStats.totalZones} zones</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top 3 plus grands rayons */}
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  Plus grands rayons
                </h4>
                <div className="space-y-2">
                  {radiusStats.topLargest.map((item, index) => (
                    <div key={index} className="text-xs">
                      <div className="font-semibold text-red-700">
                         {item.radius / 1000} km
                      </div>
                      <div className="text-red-600">
                        {item.fliiinkerName} - {item.serviceName}
                      </div>
                      <div className="text-red-500">{item.city}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 3 plus petits rayons */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  Plus petits rayons
                </h4>
                <div className="space-y-2">
                  {radiusStats.topSmallest.map((item, index) => (
                    <div key={index} className="text-xs">
                      <div className="font-semibold text-green-700">
                        {item.radius / 1000} km
                      </div>
                      <div className="text-green-600">
                        {item.fliiinkerName} - {item.serviceName}
                      </div>
                      <div className="text-green-500">{item.city}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques par ville */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Répartition par Ville
          </h3>
          
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {cityStats.slice(0, 10).map((city, index) => (
              <div key={city.city} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">{city.city}</h4>
                  <div className="text-xs text-gray-600">
                    {city.fliiinkersCount} fliiinkers • {city.servicesCount} services
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-blue-100 rounded p-2 text-center">
                    <div className="text-lg font-bold text-blue-700">{city.avgPrice.toFixed(2)}€</div>
                    <div className="text-xs text-blue-600">Prix moyen</div>
                  </div>
                  <div className="bg-green-100 rounded p-2 text-center">
                    <div className="text-lg font-bold text-green-700">{(city.avgRadius / 1000).toFixed(1)}km</div>
                    <div className="text-xs text-green-600">Rayon moyen</div>
                  </div>
                </div>

                {/* Services dans cette ville */}
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">Taux horaire moyen par service :</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(city.services).slice(0, 3).map(([serviceName, serviceData]) => (
                      <span key={serviceName} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                        {serviceName}: {serviceData.avgPrice.toFixed(0)}€
                      </span>
                    ))}
                    {Object.keys(city.services).length > 3 && (
                      <span className="text-xs text-gray-500">+{Object.keys(city.services).length - 3} autres</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques de densité en bas */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-blue-600">{densityPoints.length}</p>
            <p className="text-sm text-blue-800">Zones de chevauchement</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-600">
              {densityPoints.length > 0 
                ? Math.round(densityPoints.reduce((sum, point) => sum + point.avgPrice, 0) / densityPoints.length)
                : 0}€
            </p>
            <p className="text-sm text-green-800">Prix moyen des zones denses</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-purple-600">
              {radiusStats.avgRadius / 1000}km
            </p>
            <p className="text-sm text-purple-800">Rayon moyen global</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-orange-600">
              {cityStats.length}
            </p>
            <p className="text-sm text-orange-800">Villes couvertes</p>
          </div>
        </div>
      </div>
    </div>
  )
} 