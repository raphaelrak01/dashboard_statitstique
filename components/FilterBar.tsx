'use client'

import { Filter } from 'lucide-react'

interface FilterBarProps {
  filters: {
    status: string
    isValidated: string
    isPro: string
    verificationStatus: string
  }
  onFiltersChange: (filters: any) => void
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const resetFilters = () => {
    onFiltersChange({
      status: 'all',
      isValidated: 'all',
      isPro: 'all',
      verificationStatus: 'all'
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all')

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtre par statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut du profil
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="created">Créé</option>
            <option value="pending">En attente</option>
            <option value="active">Actif</option>
          </select>
        </div>

        {/* Filtre par validation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Validation
          </label>
          <select
            value={filters.isValidated}
            onChange={(e) => handleFilterChange('isValidated', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Tous</option>
            <option value="true">Validé</option>
            <option value="false">Non validé</option>
          </select>
        </div>

        {/* Filtre par statut Pro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut Pro
          </label>
          <select
            value={filters.isPro}
            onChange={(e) => handleFilterChange('isPro', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Tous</option>
            <option value="true">Professionnel</option>
            <option value="false">Particulier</option>
          </select>
        </div>

        {/* Filtre par vérification d'identité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vérification d'identité
          </label>
          <select
            value={filters.verificationStatus}
            onChange={(e) => handleFilterChange('verificationStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Tous</option>
            <option value="verified">Vérifié</option>
            <option value="pending">En attente</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>
      </div>

      {/* Indicateurs de filtres actifs */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value === 'all') return null
              
              const labels: Record<string, string> = {
                status: 'Statut',
                isValidated: 'Validation',
                isPro: 'Type',
                verificationStatus: 'Vérification'
              }

              const valueLabels: Record<string, string> = {
                created: 'Créé',
                pending: 'En attente',
                active: 'Actif',
                true: key === 'isPro' ? 'Pro' : 'Validé',
                false: key === 'isPro' ? 'Particulier' : 'Non validé',
                verified: 'Vérifié',
                rejected: 'Rejeté'
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  {labels[key]}: {valueLabels[value] || value}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 