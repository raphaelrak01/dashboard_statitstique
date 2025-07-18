'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FliiinkerData } from '@/types/database'
import { MapPin, Target, Euro, Users, Layers } from 'lucide-react'

// Fix pour les icônes Leaflet dans Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface GlobalFliiinkersMapProps {
  fliiinkers: FliiinkerData[]
  height?: string
}

interface ZoneOverlap {
  lat: number
  lng: number
  overlaps: number
  services: string[]
  fliiinkers: string[]
}

// Composant pour ajuster automatiquement la vue de la carte
function MapBounds({ fliiinkers }: { fliiinkers: FliiinkerData[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (fliiinkers.length === 0) return
    
    const addresses = fliiinkers.flatMap(f => f.addresses)
    if (addresses.length === 0) return
    
    const bounds = addresses.reduce((bounds, address) => {
      return bounds.extend([address.latitude, address.longitude])
    }, L.latLngBounds([addresses[0].latitude, addresses[0].longitude], [addresses[0].latitude, addresses[0].longitude]))
    
    map.fitBounds(bounds, { padding: [20, 20] })
  }, [fliiinkers, map])
  
  return null
}

export default function GlobalFliiinkersMap({ fliiinkers, height = '600px' }: GlobalFliiinkersMapProps) {
  const [showCircles, setShowCircles] = useState(true)
  const [selectedService, setSelectedService] = useState<string>('all')
  const [densityMode, setDensityMode] = useState(false)

  // Calculer le centre de la carte basé sur toutes les adresses
  const getMapCenter = (): [number, number] => {
    const addresses = fliiinkers.flatMap(f => f.addresses)
    if (addresses.length === 0) return [48.8566, 2.3522] // Paris par défaut
    
    const avgLat = addresses.reduce((sum, addr) => sum + addr.latitude, 0) / addresses.length
    const avgLng = addresses.reduce((sum, addr) => sum + addr.longitude, 0) / addresses.length
    
    return [avgLat, avgLng]
  }

  // Récupérer tous les services uniques
  const getAllServices = () => {
    const services = new Set<string>()
    fliiinkers.forEach(fliiinker => {
      fliiinker.services.forEach(service => {
        const serviceDetail = fliiinker.serviceDetails.find(sd => sd.id === service.service_id)
        services.add(serviceDetail?.name || `Service #${service.service_id}`)
      })
    })
    return Array.from(services).sort()
  }

  // Calculer les chevauchements de zones
  const calculateZoneOverlaps = (): ZoneOverlap[] => {
    const overlaps: ZoneOverlap[] = []
    const gridSize = 0.005 // Taille de la grille pour la détection de chevauchement
    const overlapMap = new Map<string, ZoneOverlap>()

    fliiinkers.forEach(fliiinker => {
      fliiinker.addresses.forEach(address => {
        fliiinker.addressLocations
          .filter(loc => loc.address_id === address.id)
          .forEach(location => {
            const serviceDetail = fliiinker.serviceDetails.find(sd => sd.id === location.service_id)
            const serviceName = serviceDetail?.name || `Service #${location.service_id}`
            
            if (selectedService !== 'all' && serviceName !== selectedService) return

            // Créer des points dans la zone de service
            const radiusInDegrees = location.radius_max / 111 // Approximation: 1 degré ≈ 111 km
            
            for (let latOffset = -radiusInDegrees; latOffset <= radiusInDegrees; latOffset += gridSize) {
              for (let lngOffset = -radiusInDegrees; lngOffset <= radiusInDegrees; lngOffset += gridSize) {
                const distance = Math.sqrt(latOffset ** 2 + lngOffset ** 2)
                if (distance <= radiusInDegrees) {
                  const gridLat = address.latitude + latOffset
                  const gridLng = address.longitude + lngOffset
                  const key = `${Math.round(gridLat / gridSize) * gridSize},${Math.round(gridLng / gridSize) * gridSize}`
                  
                  if (!overlapMap.has(key)) {
                    overlapMap.set(key, {
                      lat: gridLat,
                      lng: gridLng,
                      overlaps: 0,
                      services: [],
                      fliiinkers: []
                    })
                  }
                  
                  const overlap = overlapMap.get(key)!
                  overlap.overlaps++
                  if (!overlap.services.includes(serviceName)) {
                    overlap.services.push(serviceName)
                  }
                  const fliiinkerName = `${fliiinker.profile.first_name} ${fliiinker.profile.last_name}`
                  if (!overlap.fliiinkers.includes(fliiinkerName)) {
                    overlap.fliiinkers.push(fliiinkerName)
                  }
                }
              }
            }
          })
      })
    })

    return Array.from(overlapMap.values()).filter(overlap => overlap.overlaps > 1)
  }

  // Obtenir la couleur basée sur la densité de chevauchement
  const getOverlapColor = (overlaps: number): string => {
    if (overlaps <= 2) return '#3b82f6' // Bleu
    if (overlaps <= 4) return '#8b5cf6' // Violet
    if (overlaps <= 6) return '#ef4444' // Rouge
    return '#dc2626' // Rouge foncé
  }

  // Obtenir l'opacité basée sur la densité
  const getOverlapOpacity = (overlaps: number): number => {
    return Math.min(0.1 + (overlaps * 0.1), 0.8)
  }

  const center = getMapCenter()
  const allServices = getAllServices()
  const zoneOverlaps = densityMode ? calculateZoneOverlaps() : []

  // Filtrer les fliiinkers selon le service sélectionné
  const filteredFliiinkers = selectedService === 'all' 
    ? fliiinkers 
    : fliiinkers.filter(f => 
        f.services.some(s => {
          const serviceDetail = f.serviceDetails.find(sd => sd.id === s.service_id)
          return (serviceDetail?.name || `Service #${s.service_id}`) === selectedService
        })
      )

  // Statistiques de la vue actuelle
  const currentStats = {
    totalFliiinkers: filteredFliiinkers.length,
    totalAddresses: filteredFliiinkers.reduce((sum, f) => sum + f.addresses.length, 0),
    totalZones: filteredFliiinkers.reduce((sum, f) => sum + f.addressLocations.length, 0),
    avgRadius: filteredFliiinkers.length > 0 
      ? Math.round((filteredFliiinkers.reduce((sum, f) => {
          const radii = f.addressLocations.map(loc => loc.radius_max)
          return sum + (radii.length > 0 ? radii.reduce((s, r) => s + r, 0) / radii.length : 0)
        }, 0) / filteredFliiinkers.length) * 100) / 100
      : 0
  }

  return (
    <div className="space-y-4">
      {/* Contrôles de la carte */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              Carte Globale des Fliiinkers
            </h3>
            
            {/* Statistiques en temps réel */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-blue-600">{currentStats.totalFliiinkers}</span>
                <span className="text-gray-600">fliiinkers</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-green-600">{currentStats.totalAddresses}</span>
                <span className="text-gray-600">adresses</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-orange-600">{currentStats.avgRadius}km</span>
                <span className="text-gray-600">rayon moyen</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sélecteur de service */}
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les services</option>
              {allServices.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>

            {/* Toggle zones de service */}
            <button
              onClick={() => setShowCircles(!showCircles)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showCircles 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Target className="w-4 h-4 inline mr-1" />
              Zones
            </button>

            {/* Toggle mode densité */}
            <button
              onClick={() => setDensityMode(!densityMode)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                densityMode 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-1" />
              Densité
            </button>
          </div>
        </div>
      </div>

      {/* Légende pour le mode densité */}
      {densityMode && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-100 rounded-lg p-4 border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2">Légende - Chevauchements de zones</h4>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 opacity-30"></div>
              <span>2-3 chevauchements</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-500 opacity-50"></div>
              <span>4-5 chevauchements</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500 opacity-70"></div>
              <span>6+ chevauchements</span>
            </div>
          </div>
        </div>
      )}

      {/* Carte */}
      <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
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
          
          <MapBounds fliiinkers={filteredFliiinkers} />
          
          {/* Marqueurs pour les adresses */}
          {filteredFliiinkers.map((fliiinker) =>
            fliiinkers.addresses.map((address) => (
              <Marker 
                key={`${fliiinker.profile.id}-${address.id}`}
                position={[address.latitude, address.longitude]}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-gray-800 mb-2">
                      {fliiinkers.profile.first_name} {fliiinkers.profile.last_name}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-blue-600">{address.name}</p>
                      <p className="text-gray-600">{address.street}</p>
                      <p className="text-gray-600">{address.city}, {address.zip_code}</p>
                      
                      {/* Services de ce fliiinker */}
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="font-semibold text-gray-700 mb-1">Services :</p>
                        {fliiinkers.services.map(service => {
                          const serviceDetail = fliiinkers.serviceDetails.find(sd => sd.id === service.service_id)
                          return (
                            <div key={service.service_id} className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">
                                {serviceDetail?.name || `Service #${service.service_id}`}
                              </span>
                              <span className="font-semibold text-green-600">
                                {service.hourly_rate}€/h
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))
          )}

          {/* Zones de service ou heatmap de densité */}
          {densityMode ? (
            // Mode densité - afficher les chevauchements
            zoneOverlaps.map((overlap, index) => (
              <Circle
                key={`overlap-${index}`}
                center={[overlap.lat, overlap.lng]}
                radius={200} // Petit rayon pour la visualisation
                pathOptions={{
                  color: getOverlapColor(overlap.overlaps),
                  fillColor: getOverlapColor(overlap.overlaps),
                  fillOpacity: getOverlapOpacity(overlap.overlaps),
                  weight: 0
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-gray-800 mb-2">Zone de densité</h4>
                    <p className="text-sm"><strong>Chevauchements:</strong> {overlap.overlaps}</p>
                    <p className="text-sm"><strong>Services:</strong> {overlap.services.join(', ')}</p>
                    <p className="text-sm"><strong>Fliiinkers:</strong> {overlap.fliiinkers.join(', ')}</p>
                  </div>
                </Popup>
              </Circle>
            ))
          ) : (
            // Mode normal - afficher les zones de service
            showCircles && filteredFliiinkers.map((fliiinker) =>
              fliiinkers.addresses.map((address) =>
                fliiinkers.addressLocations
                  .filter(location => location.address_id === address.id)
                  .filter(location => {
                    if (selectedService === 'all') return true
                    const serviceDetail = fliiinkers.serviceDetails.find(sd => sd.id === location.service_id)
                    return (serviceDetail?.name || `Service #${location.service_id}`) === selectedService
                  })
                  .map((location, index) => {
                    const serviceDetail = fliiinkers.serviceDetails.find(sd => sd.id === location.service_id)
                    return (
                      <Circle
                        key={`${fliiinker.profile.id}-${address.id}-${location.service_id}-${index}`}
                        center={[address.latitude, address.longitude]}
                        radius={location.radius_max * 1000} 
                        pathOptions={{
                          color: '#3b82f6',
                          fillColor: '#3b82f6',
                          fillOpacity: 0.1,
                          weight: 1
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold text-gray-800">Zone de service</h3>
                            <p className="text-sm"><strong>Fliiinker:</strong> {fliiinkers.profile.first_name} {fliiinkers.profile.last_name}</p>
                            <p className="text-sm"><strong>Service:</strong> {serviceDetail?.name || `Service #${location.service_id}`}</p>
                            <p className="text-sm"><strong>Rayon:</strong> {location.radius_max} km</p>
                            <p className="text-sm"><strong>Tarif:</strong> {location.hourly_rate}€/h</p>
                          </div>
                        </Popup>
                      </Circle>
                    )
                  })
              )
            )
          )}
        </MapContainer>
      </div>
    </div>
  )
} 