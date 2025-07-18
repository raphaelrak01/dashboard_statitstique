'use client'

import { FliiinkerData, DecisionAction } from '@/types/database'
import { MapPin, CheckCircle, XCircle, Users, Star, Calendar, Briefcase, Phone } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const base_url_image = process.env.NEXT_PUBLIC_BASE_URL_IMAGE

// Fonction pour construire l'URL de l'avatar
const getAvatarUrl = (avatar?: string, firstName?: string, lastName?: string) => {
  // Si on a une URL de base et un avatar
  if (base_url_image && avatar) {
    return `${base_url_image}/${avatar}`
  }
  
  // Fallback vers le générateur d'avatar
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=3b82f6&color=fff`
}

interface FliiinkerCardProps {
  fliiinker: FliiinkerData
  decision?: DecisionAction
  onDecision: (fliiinkerId: string, action: DecisionAction) => void
  onViewDetails: (fliiinker: FliiinkerData) => void
}

export default function FliiinkerCard({ fliiinker, decision, onDecision, onViewDetails }: FliiinkerCardProps) {
  const { profile, fliiinkerProfile, addresses, services, serviceDetails } = fliiinker

  // Obtenir l'adresse principale
  const mainAddress = addresses.find(addr => addr.is_default) || addresses[0]
  
  // Obtenir les services actifs avec leurs détails
  const activeServices = services
    .filter(service => service.is_active)
    .map(service => {
      const details = serviceDetails.find(sd => sd.id === service.service_id)
      return {
        ...service,
        name: details?.name || `Service #${service.service_id}`,
        description: details?.description
      }
    })

  const getDecisionStyle = (action: DecisionAction) => {
    switch (action) {
      case 'approve':
        return 'bg-success-500 hover:bg-success-600 text-white'
      case 'reject':
        return 'bg-danger-500 hover:bg-danger-600 text-white'
      case 'review':
        return 'bg-warning-500 hover:bg-warning-600 text-white'
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  }

  const getDecisionLabel = (action: DecisionAction) => {
    switch (action) {
      case 'approve':
        return 'Approuvé'
      case 'reject':
        return 'Rejeté'
      case 'review':
        return 'À réviser'
      case 'pending':
        return 'En attente'
      default:
        return 'Aucune'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header avec avatar et infos de base */}
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={getAvatarUrl(profile.avatar, profile.first_name, profile.last_name)}
            alt={`${profile.first_name} ${profile.last_name}`}
            className="w-16 h-16 rounded-full border-2 border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {profile.first_name} {profile.last_name}
            </h3>
            <p className="text-sm text-gray-600 truncate">{profile.email}</p>
            {fliiinkerProfile?.tagline && (
              <p className="text-sm text-primary-600 font-medium truncate mt-1">
                "{fliiinkerProfile.tagline}"
              </p>
            )}
          </div>
        </div>

        {/* Statuts */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`badge ${fliiinkerProfile?.status === 'active' ? 'badge-success' : 'badge-gray'}`}>
            {fliiinkerProfile?.status === 'active' ? 'Actif' : 'Inactif'}
          </span>
          <span className={`badge ${fliiinkerProfile?.is_pro ? 'badge-primary' : 'badge-secondary'}`}>
            {fliiinkerProfile?.is_pro ? 'Pro' : 'Particulier'}
          </span>
          {fliiinkerProfile?.is_validated && (
            <span className="badge badge-success">
              <CheckCircle className="w-3 h-3 mr-1" />
              Validé
            </span>
          )}
        </div>

        {/* Localisation */}
        {mainAddress && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {mainAddress.city}, {mainAddress.zip_code}
            </span>
          </div>
        )}

        {/* Phone Number */ }
        {profile.phone && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{profile.phone}</span>
          </div>
        )}

        {/* Description du profil fliiinker */}
        {fliiinkerProfile?.description && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Description du profil</span>
            </div>
            <div className="max-h-24 overflow-y-auto">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {fliiinkerProfile.description}
              </p>
            </div>
          </div>
        )}

        {/* Services actifs */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium flex items-center">
              <Briefcase className="w-4 h-4 mr-1 text-blue-600" />
              Services actifs
            </span>
            <span className="badge badge-primary text-xs">
              {activeServices.length}
            </span>
          </div>
          {activeServices.length > 0 ? (
            <div className="space-y-2">
              {activeServices.slice(0, 3).map((service, index) => (
                <div key={service.service_id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                    {service.name}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {service.hourly_rate.toFixed(0)}€/h
                  </span>
                </div>
              ))}
              {activeServices.length > 3 && (
                <p className="text-xs text-gray-500 mt-1">
                  +{activeServices.length - 3} autres services
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun service actif</p>
          )}
        </div>

        {/* Informations complémentaires */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">Services totaux :</span>
            <br />
            {services.length}
          </div>
          <div>
            <span className="font-medium">Adresses :</span>
            <br />
            {addresses.length}
          </div>
        </div>

        {/* Date de création */}
        <div className="text-xs text-gray-500 mb-4 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          Créé le {format(new Date(profile.created_at), 'dd/MM/yyyy', { locale: fr })}
        </div>

        

          {/* Bouton voir détails */}
          <button
            onClick={() => onViewDetails(fliiinker)}
            className="btn btn-primary w-full"
          >
            Voir les détails
          </button>
        </div>
      </div>
  )
} 