'use client'

import { Search, X, Sparkles } from 'lucide-react'
import { Input } from '@heroui/react'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (searchTerm: string) => void
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const clearSearch = () => {
    onSearchChange('')
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header élégant */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">
            Recherche Intelligente
          </h3>
        </div>
        <p className="text-gray-500 font-light">
          Trouvez instantanément le profil que vous recherchez
        </p>
      </div>

      {/* Container principal avec bordures premium */}
      <div className="bg-white/80 backdrop-blur-lg border-2 border-gray-200/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-pink-500/3"></div>
        
        <div className="relative">
          {/* Barre de recherche premium */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Tapez un nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              startContent={
                <div className="w-6 h-6 bg-apple-intelligence rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
              }
              endContent={
                searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300 group"
                  >
                    <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                )
              }
              classNames={{
                base: "w-full",
                mainWrapper: "h-full",
                input: "text-lg font-light placeholder:text-gray-400 placeholder:font-light",
                inputWrapper: [
                  "bg-white/90",
                  "backdrop-blur-sm",
                  "border-2",
                  "border-gray-200/50",
                  "hover:border-gray-300/50",
                  "focus-within:border-blue-400/50",
                  "focus-within:bg-white",
                  "h-16",
                  "px-6",
                  "rounded-2xl",
                  "shadow-lg",
                  "hover:shadow-xl",
                  "transition-all",
                  "duration-500",
                  "group-hover:scale-[1.01]"
                ],
              }}
            />
          </div>

          {/* Suggestions ou hints */}
          {!searchTerm && (
            <div className="mt-6 flex justify-center space-x-3">
              {['RAKOTONAIVO', 'Aina', 'Raphaël'].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSearchChange(suggestion)}
                  className="text-xs text-gray-500 hover:text-gray-700 bg-gray-50/80 hover:bg-gray-100/80 px-3 py-2 rounded-full border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 font-medium"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Indicateur de recherche active premium */}
          {searchTerm && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-apple-intelligence rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Recherche en cours
                      </p>
                      <p className="text-xs text-gray-500 font-light">
                        Résultats pour <span className="font-semibold text-blue-700">"{searchTerm}"</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 bg-white/60 hover:bg-white/80 px-4 py-2 rounded-full border border-gray-200/50 transition-all duration-300 group"
                  >
                    <X className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="text-xs font-medium">Effacer</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats de recherche */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400 font-light">
          Recherche instantanée parmi tous les profils • Powered by Intelligence
        </p>
      </div>
    </div>
  )
} 