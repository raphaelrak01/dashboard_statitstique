'use client'

import { FliiinkerData, DecisionAction } from '@/types/database'
import { Check, X, Clock, Eye, MapPin, Phone, Mail, Star, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface FliiinkerCardProps {
  fliiinker: FliiinkerData
  decision?: DecisionAction
  onDecision: (fliiinkerId: string, action: DecisionAction) => void
  onViewDetails?: (fliiinker: FliiinkerData) => void
}

const base_url_image = process.env.NEXT_PUBLIC_BASE_URL_IMAGE
console.log('Base URL Image:', base_url_image)

// Fonction pour construire l'URL de l'avatar
const getAvatarUrl = (avatar?: string, firstName?: string, lastName?: string) => {
  // Si on a une URL de base et un avatar
  if (base_url_image && avatar) {
    return `${base_url_image}/${avatar}`
  }
  
  // Fallback vers le générateur d'avatar
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=3b82f6&color=fff`
}

export default function FliiinkerCard({ fliiinker, decision, onDecision, onViewDetails }: FliiinkerCardProps) {
  const { profile, fliiinkerProfile, services, addresses, administrativeData } = fliiinker

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Actif</span>
      case 'pending':
        return <span className="badge badge-warning">En attente</span>
      case 'created':
        return <span className="badge badge-gray">Créé</span>
      default:
        return <span className="badge badge-gray">Inconnu</span>
    }
  }

  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return <span className="badge badge-success">Vérifié</span>
      case 'pending':
        return <span className="badge badge-warning">En attente</span>
      case 'rejected':
        return <span className="badge badge-danger">Rejeté</span>
      default:
        return <span className="badge badge-gray">Non vérifié</span>
    }
  }

  const getDecisionStyle = () => {
    switch (decision) {
      case 'approve':
        return 'ring-2 ring-success-500 bg-success-50'
      case 'reject':
        return 'ring-2 ring-danger-500 bg-danger-50'
      case 'review':
        return 'ring-2 ring-warning-500 bg-warning-50'
      default:
        return ''
    }
  }

  const address = addresses[0]
  const service = services[0]

  return (
    <div className={`card transition-all duration-200 ${getDecisionStyle()}`}>
      {/* En-tête avec avatar et infos de base */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <img
            src={getAvatarUrl(profile.avatar, profile.first_name, profile.last_name)}
            alt={`${profile.first_name} ${profile.last_name}`}
            className="w-16 h-16 rounded-full border-2 border-gray-200"
            onError={(e) => {
              // En cas d'erreur de chargement, utilise le fallback
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&background=3b82f6&color=fff`
            }}
          />
          {/* Debug info - à supprimer en production
          {base_url_image && (
            <p className="text-xs text-gray-500 mt-1">
              URL: {getAvatarUrl(profile.avatar, profile.first_name, profile.last_name)}
            </p>
          )} */}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {profile.first_name} {profile.last_name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{profile.email}</p>
          <div className="flex items-center space-x-2 mt-1">
            {getStatusBadge(fliiinkerProfile?.status)}
            {fliiinkerProfile?.is_pro && (
              <span className="badge badge-success">Pro</span>
            )}
            {fliiinkerProfile?.is_validated && (
              <span className="inline-flex items-center">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tagline */}
      {fliiinkerProfile?.tagline && (
        <p className="text-sm text-gray-600 italic mb-3">
          "{fliiinkerProfile.tagline}"
        </p>
      )}

      {/* Informations détaillées */}
      <div className="space-y-3 mb-4">
        {/* Contact */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{profile.phone || 'Non renseigné'}</span>
        </div>

        {/* Adresse */}
        {address && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{address.city}, {address.zip_code}</span>
          </div>
        )}

        {/* Service principal */}
        {service && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Service principal</span>
              <span className={`badge ${service.is_active ? 'badge-success' : 'badge-gray'}`}>
                {service.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
            <p className="text-sm font-semibold text-primary-600 mt-1">
              {service.hourly_rate.toFixed(0)}€/h
            </p>
          </div>
        )}

        {/* Données administratives */}
        {administrativeData && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Vérifications</span>
              {getVerificationBadge(administrativeData.id_card_verification_status)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${administrativeData.ssn_is_valid ? 'bg-success-500' : 'bg-gray-300'}`} />
                <span>Sécu. sociale</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${administrativeData.has_driver_liscence ? 'bg-success-500' : 'bg-gray-300'}`} />
                <span>Permis</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${administrativeData.has_car ? 'bg-success-500' : 'bg-gray-300'}`} />
                <span>Véhicule</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${administrativeData.is_entrepreneur ? 'bg-success-500' : 'bg-gray-300'}`} />
                <span>Entrepreneur</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* État de la décision */}
      {decision && (
        <div className="mb-4 p-3 rounded-lg bg-gray-50 border-l-4 border-primary-500">
          <p className="text-sm font-medium text-gray-900">
            Décision prise : 
            <span className={`ml-2 ${
              decision === 'approve' ? 'text-success-600' :
              decision === 'reject' ? 'text-danger-600' :
              decision === 'review' ? 'text-warning-600' :
              'text-gray-600'
            }`}>
              {decision === 'approve' ? 'Approuvé' :
               decision === 'reject' ? 'Rejeté' :
               decision === 'review' ? 'À revoir' :
               'En attente'}
            </span>
          </p>
        </div>
      )}

      {/* Bouton voir les détails */}
      <div className="mb-4">
        <button
          onClick={() => onViewDetails?.(fliiinker)}
          className="w-full btn btn-primary text-sm py-2"
        >
          <Eye className="w-4 h-4 mr-2" />
          Voir les détails
        </button>
      </div>

      {/* Boutons d'action
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onDecision(profile.id, 'approve')}
          className={`btn btn-success text-xs py-2 ${decision === 'approve' ? 'ring-2 ring-success-300' : ''}`}
          title="Approuver"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDecision(profile.id, 'reject')}
          className={`btn btn-danger text-xs py-2 ${decision === 'reject' ? 'ring-2 ring-danger-300' : ''}`}
          title="Rejeter"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDecision(profile.id, 'review')}
          className={`btn btn-warning text-xs py-2 ${decision === 'review' ? 'ring-2 ring-warning-300' : ''}`}
          title="À revoir"
        >
          <AlertCircle className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDecision(profile.id, 'pending')}
          className={`btn btn-secondary text-xs py-2 ${decision === 'pending' ? 'ring-2 ring-gray-300' : ''}`}
          title="Remettre en attente"
        >
          <Clock className="w-4 h-4" />
        </button>
      </div>

      {/* Timestamp de création */}
      {/* <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Créé le {format(new Date(profile.created_at), 'dd/MM/yyyy', { locale: fr })}
        </p>
      </div> */}
    </div>
  )
} 