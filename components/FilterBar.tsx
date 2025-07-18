'use client'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (searchTerm: string) => void
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const clearSearch = () => {
    onSearchChange('')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Recherche</h3>
        </div>
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Effacer</span>
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Indicateur de recherche active */}
      {searchTerm && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Recherche active: <span className="font-medium">"{searchTerm}"</span>
            </span>
            <button
              onClick={clearSearch}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Tout afficher
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 