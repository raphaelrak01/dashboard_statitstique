'use client'

import { FliiinkerData, DecisionAction } from '@/types/database'
import { MapPin, CheckCircle, Calendar, Briefcase, Phone, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Avatar } from '@heroui/react'

const base_url_image = process.env.NEXT_PUBLIC_BASE_URL_IMAGE

// Fonction pour construire l'URL de l'avatar
const getAvatarUrl = (avatar?: string, firstName?: string, lastName?: string) => {
  // Si on a une URL de base et un avatar
  if (base_url_image && avatar) {
    return `${base_url_image}/${avatar}`
  }
  
  // Fallback vers le générateur d'avatar avec paramètres améliorés
  const name = `${firstName || 'U'}+${lastName || 'ser'}`
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=2997ff&color=ffffff&bold=true&format=png`
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

  return (
    <div className="h-full flex flex-col bg-white/90 backdrop-blur-sm border-2 border-gray-100/50 hover:border-gray-200/50 rounded-3xl p-6 hover:shadow-2xl hover:bg-white transition-all duration-500 group relative overflow-hidden">
      {/* Effet de bordure animé au hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative flex flex-col h-full">
        {/* Header avec avatar et infos de base - Partie fixe */}
        <div className="text-center mb-4">
          <div className="relative inline-block mb-4">
            <Avatar
              src={getAvatarUrl(profile.avatar, profile.first_name, profile.last_name)}
              alt={`${profile.first_name} ${profile.last_name}`}
              className="w-16 h-16 text-large shadow-lg ring-2 ring-white/50 group-hover:ring-4 transition-all duration-500"
              imgProps={{
                className: "object-cover w-full h-full"
              }}
              fallback={
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </div>
              }
            />
            {fliiinkerProfile?.is_validated && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          {/* Nom avec dégradé Apple Intelligence - plus gros et plus lisible */}
          <h3 
            className="text-xl font-bold mb-1 leading-tight"
            style={{
              background: 'linear-gradient(90deg, #2997ff, #a259c2, #f46f30, #f4284a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '700'
            }}
          >
            {profile.first_name} {profile.last_name}
          </h3>
          
          <p className="text-xs text-gray-600 font-medium mb-3">{profile.email}</p>
        </div>

        {/* Statuts compacts */}
        <div className="flex justify-center space-x-1 mb-4">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
            fliiinkerProfile?.status === 'active' 
              ? 'bg-green-50/80 text-green-800 border-green-200/50' 
              : 'bg-gray-50/80 text-gray-700 border-gray-200/50'
          }`}>
            {fliiinkerProfile?.status === 'active' ? 'Actif' : 'Inactif'}
          </span>
          
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${
            fliiinkerProfile?.is_pro 
              ? 'bg-blue-50/80 text-blue-800 border-blue-200/50' 
              : 'bg-gray-50/80 text-gray-700 border-gray-200/50'
          }`}>
            {fliiinkerProfile?.is_pro ? 'Pro' : 'Particulier'}
          </span>
          
          {fliiinkerProfile?.is_validated && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-50/80 text-green-800 border border-green-200/50">
              Validé
            </span>
          )}
        </div>

        {/* Informations de contact compactes */}
        <div className="space-y-2 mb-4">
          {mainAddress && (
            <div className="flex items-center justify-center text-xs text-gray-700 bg-gray-50/50 rounded-xl p-2 border border-gray-100/50">
              <MapPin className="w-3 h-3 mr-2 text-gray-500" />
              <span className="font-semibold">
                {mainAddress.city}, {mainAddress.zip_code}
              </span>
            </div>
          )}
          
          {profile.phone && (
            <div className="flex items-center justify-center text-xs text-gray-700 bg-gray-50/50 rounded-xl p-2 border border-gray-100/50">
              <Phone className="w-3 h-3 mr-2 text-gray-500" />
              <span className="font-semibold">{profile.phone}</span>
            </div>
          )}
        </div>

        {/* Description plus visible et plus lisible - partie extensible */}
        <div className="flex-1 mb-4">
          {fliiinkerProfile?.description && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/90 rounded-xl p-4 border border-gray-200/50 backdrop-blur-sm h-full flex flex-col">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                  Description
                </p>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">
                    {fliiinkerProfile.description}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {fliiinkerProfile?.tagline && !fliiinkerProfile?.description && (
            <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-xl p-3 border border-gray-100/50">
              <p className="text-sm text-gray-800 font-medium italic leading-relaxed text-center">
                "{fliiinkerProfile.tagline}"
              </p>
            </div>
          )}
        </div>

        {/* Services compacts */}
        <div className="mb-4">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Services
            </span>
            <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold border border-blue-200/50">
              {activeServices.length}
            </span>
          </div>
          
          {activeServices.length > 0 ? (
            <div className="space-y-2">
              {activeServices.slice(0, 2).map((service, index) => (
                <div key={service.service_id} className="flex justify-between items-center bg-white/60 rounded-lg p-2 border border-gray-100/50 backdrop-blur-sm">
                  <span className="text-xs text-gray-800 font-semibold truncate flex-1 mr-2">
                    {service.name}
                  </span>
                  <span className="text-xs font-bold text-gray-900 bg-gradient-to-r from-gray-50 to-gray-100 px-2 py-1 rounded-full border border-gray-200/50 whitespace-nowrap">
                    {service.hourly_rate.toFixed(0)}€/h
                  </span>
                </div>
              ))}
              {activeServices.length > 2 && (
                <p className="text-xs text-gray-500 font-medium text-center mt-2">
                  +{activeServices.length - 2} autres services
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 font-medium bg-gray-50/50 rounded-lg p-3 border border-gray-100/50 text-center">
              Aucun service actif
            </p>
          )}
        </div>

        {/* Métriques compactes */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center bg-gradient-to-br from-blue-50/50 to-blue-100/50 rounded-xl p-3 border border-blue-100/50">
            <div className="text-xl font-semibold text-blue-800 mb-1">{services.length}</div>
            <div className="text-xs text-blue-700 font-bold uppercase tracking-wide">Services</div>
          </div>
          <div className="text-center bg-gradient-to-br from-purple-50/50 to-purple-100/50 rounded-xl p-3 border border-purple-100/50">
            <div className="text-xl font-semibold text-purple-800 mb-1">{addresses.length}</div>
            <div className="text-xs text-purple-700 font-bold uppercase tracking-wide">Adresses</div>
          </div>
        </div>

        {/* Partie inférieure fixe - Date et bouton toujours alignés */}
        <div className="mt-auto">
          {/* Date de création compacte */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center text-xs text-gray-500 font-medium bg-gray-50/50 rounded-full px-3 py-1 border border-gray-100/50">
              <Calendar className="w-3 h-3 mr-1" />
              <span>
                Depuis {format(new Date(profile.created_at), 'MM/yyyy', { locale: fr })}
              </span>
            </div>
          </div>

          {/* Bouton principal toujours aligné en bas */}
          <button
            onClick={() => onViewDetails(fliiinker)}
            className="w-full bg-apple-intelligence text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center space-x-2 relative overflow-hidden group/button"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
            <Eye className="w-4 h-4 relative z-10" />
            <span className="relative z-10 text-sm">Voir les détails</span>
          </button>
        </div>
      </div>
    </div>
  )
} 