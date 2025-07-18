'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FliiinkerData } from '@/types/database'

// Fix pour les icônes Leaflet dans Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface FliiinkerMapProps {
  fliiinker: FliiinkerData
  height?: string
}

export default function FliiinkerMap({ fliiinker, height = '400px' }: FliiinkerMapProps) {
  const { addresses, addressLocations } = fliiinker

  // Prendre la première adresse comme centre par défaut
  const primaryAddress = addresses[0]
  
  if (!primaryAddress) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center`} style={{ height }}>
        <p className="text-gray-500">Aucune adresse disponible</p>
      </div>
    )
  }

  const center: [number, number] = [primaryAddress.latitude, primaryAddress.longitude]

  return (
    <div className="rounded-lg overflow-hidden border" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marqueurs pour les adresses */}
        {addresses.map((address) => (
          <Marker 
            key={address.id} 
            position={[address.latitude, address.longitude]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{address.name}</h3>
                <p className="text-sm text-gray-600">{address.street}</p>
                <p className="text-sm text-gray-600">{address.city}, {address.zip_code}</p>
                {address.is_default && (
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mt-1">
                    Adresse principale
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Cercles pour les rayons de service */}
        {addressLocations.map((location, index) => {
          // Trouver l'adresse correspondante
          const relatedAddress = addresses.find(addr => addr.id === location.address_id)
          if (!relatedAddress) return null

          return (
            <Circle
              key={`${location.address_id}-${location.service_id}-${index}`}
              center={[relatedAddress.latitude, relatedAddress.longitude]}
              radius={location.radius_max } // Convertir km en mètres
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">Zone de service</h3>
                  <p className="text-sm text-gray-600">Service: {location.service_name || `Service #${location.service_id}`}</p>
                  <p className="text-sm text-gray-600">Rayon: {location.radius_max} km</p>
                  <p className="text-sm text-gray-600">Tarif: {location.hourly_rate}€/h</p>
                  {location.hourly_rate_with_fees && (
                    <p className="text-sm text-gray-600">
                      Avec frais: {location.hourly_rate_with_fees}€/h
                    </p>
                  )}
                </div>
              </Popup>
            </Circle>
          )
        })}
      </MapContainer>
    </div>
  )
} 