'use client'

import { FliiinkerData } from '@/types/database'
import { X, MapPin, Phone, Mail, Calendar, Star, CheckCircle, XCircle, Car, Briefcase } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import dynamic from 'next/dynamic'

// Import dynamique pour éviter les problèmes SSR avec Leaflet
const FliiinkerMap = dynamic(() => import('./FliiinkerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Chargement de la carte...</p>
    </div>
  )
})

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

interface FliiinkerDetailModalProps {
  fliiinker: FliiinkerData | null
  isOpen: boolean
  onClose: () => void
}

export default function FliiinkerDetailModal({ fliiinker, isOpen, onClose }: FliiinkerDetailModalProps) {
  if (!isOpen || !fliiinker) return null

  const { profile, fliiinkerProfile, services, serviceDetails, addresses, administrativeData } = fliiinker

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'text-success-600 bg-success-50'
      case 'pending': return 'text-warning-600 bg-warning-50'
      case 'created': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getVerificationColor = (status?: string) => {
    switch (status) {
      case 'verified': return 'text-success-600 bg-success-50'
      case 'pending': return 'text-warning-600 bg-warning-50'
      case 'rejected': return 'text-danger-600 bg-danger-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  // Joindre les services avec leurs détails
  const servicesWithDetails = services.map(service => {
    const details = serviceDetails.find(sd => sd.id === service.service_id)
    return { ...service, details }
  })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={getAvatarUrl(profile.avatar, profile.first_name, profile.last_name)}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-16 h-16 rounded-full border-2 border-gray-200"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-gray-600">{profile.email}</p>
                {fliiinkerProfile?.tagline && (
                  <p className="text-primary-600 font-medium">"{fliiinkerProfile.tagline}"</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne gauche - Informations personnelles */}
            <div className="space-y-6">
              
              {/* Statuts et badges */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Statuts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profil</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(fliiinkerProfile?.status)}`}>
                      {fliiinkerProfile?.status === 'active' ? 'Actif' :
                       fliiinkerProfile?.status === 'pending' ? 'En attente' :
                       fliiinkerProfile?.status === 'created' ? 'Créé' : 'Inconnu'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${fliiinkerProfile?.is_pro ? 'bg-success-50 text-success-600' : 'bg-gray-50 text-gray-600'}`}>
                      {fliiinkerProfile?.is_pro ? 'Professionnel' : 'Particulier'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Validation</span>
                    <div className="flex items-center space-x-1">
                      {fliiinkerProfile?.is_validated ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-success-500" />
                          <span className="text-sm text-success-600">Validé</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Non validé</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  
                  {profile.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  
                  {profile.birthday && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {format(new Date(profile.birthday), 'dd/MM/yyyy', { locale: fr })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Données administratives */}
              {administrativeData && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Vérifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Identité</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerificationColor(administrativeData.id_card_verification_status)}`}>
                        {administrativeData.id_card_verification_status === 'verified' ? 'Vérifié' :
                         administrativeData.id_card_verification_status === 'pending' ? 'En attente' :
                         administrativeData.id_card_verification_status === 'rejected' ? 'Rejeté' : 'Non vérifié'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${administrativeData.ssn_is_valid ? 'bg-success-500' : 'bg-gray-300'}`} />
                        <span className="text-xs text-gray-600">Sécurité sociale</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Car className={`w-3 h-3 ${administrativeData.has_driver_liscence ? 'text-success-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">Permis</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${administrativeData.has_car ? 'bg-success-500' : 'bg-gray-300'}`} />
                        <span className="text-xs text-gray-600">Véhicule</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Briefcase className={`w-3 h-3 ${administrativeData.is_entrepreneur ? 'text-success-500' : 'text-gray-300'}`} />
                        <span className="text-xs text-gray-600">Entrepreneur</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Colonne centrale - Descriptions et services */}
            <div className="space-y-6">
              
              {/* Description du profil */}
              {fliiinkerProfile?.description && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Description du profil</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {fliiinkerProfile.description}
                  </p>
                  
                  {fliiinkerProfile.degree && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Diplôme : </span>
                      <span className="text-sm font-medium">{fliiinkerProfile.degree}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Services proposés */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Services proposés ({servicesWithDetails.length})</h3>
                <div className="space-y-4">
                  {servicesWithDetails.map((service, index) => (
                    <div key={`${service.service_id}-${index}`} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {service.details?.name || `Service #${service.service_id}`}
                          </h4>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${service.is_active ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'}`}>
                            {service.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">
                            {service.hourly_rate.toFixed(0)}€/h
                          </p>
                        </div>
                      </div>
                      
                      
                      
                      {/* Description personnalisée depuis fliiinker_service_mtm */}
                      {service.description && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-800 mb-1">Description personnalisée :</h5>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                      )}
                      
                      
                      
                      {/* Tags */}
                      {service.tags && service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {service.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne droite - Carte et adresses */}
            <div className="space-y-6">
              
              {/* Carte */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Localisation et zones de service</h3>
                <FliiinkerMap fliiinker={fliiinker} height="300px" />
                <p className="text-xs text-gray-500 mt-2">
                  Les cercles bleus représentent les zones de service avec leurs rayons d'intervention
                </p>
              </div>

              {/* Adresses */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Adresses ({addresses.length})</h3>
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{address.name}</h4>
                          <p className="text-sm text-gray-600">{address.street}</p>
                          <p className="text-sm text-gray-600">{address.city}, {address.zip_code}</p>
                        </div>
                        {address.is_default && (
                          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Coordonnées: {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Profil créé le {format(new Date(profile.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
            </p>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 