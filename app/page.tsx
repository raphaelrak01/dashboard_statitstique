'use client'

import { useState, useEffect } from 'react'
import { FliiinkerData, DecisionAction } from '@/types/database'
import FliiinkerCard from '@/components/FliiinkerCard'
import FilterBar from '@/components/FilterBar'
import StatsOverview from '@/components/StatsOverview'
import FliiinkerDetailModal from '@/components/FliiinkerDetailModal'
import AdvancedStatistics from '@/components/AdvancedStatistics'
import { BarChart3, Users, Map, List } from 'lucide-react'
import dynamic from 'next/dynamic'

// Import dynamique pour éviter les problèmes SSR avec Leaflet
const GlobalFliiinkerMap = dynamic(() => import('@/components/GlobalFliiinkerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Chargement de la carte globale...</p>
    </div>
  )
})

type TabType = 'list' | 'statistics' | 'map'

export default function Dashboard() {
  const [fliiinkers, setFliiinkers] = useState<FliiinkerData[]>([])
  const [filteredFliiinkers, setFilteredFliiinkers] = useState<FliiinkerData[]>([])
  const [decisions, setDecisions] = useState<Record<string, DecisionAction>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFliiinker, setSelectedFliiinker] = useState<FliiinkerData | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('list')
  const [filters, setFilters] = useState({
    status: 'all',
    isValidated: 'all',
    isPro: 'all',
    verificationStatus: 'all'
  })

  useEffect(() => {
    const loadFliiinkers = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Chargement des fliiinkers depuis l\'API...')
        
        const response = await fetch('/api/fliiinkers')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || `Erreur HTTP: ${response.status}`)
        }
        
        if (!data.success) {
          throw new Error(data.error || 'Erreur lors du chargement des données')
        }
        
        console.log(`${data.count} fliiinkers chargés`)
        
        setFliiinkers(data.data)
        setFilteredFliiinkers(data.data)
      } catch (err) {
        console.error('Erreur lors du chargement des fliiinkers:', err)
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    loadFliiinkers()
  }, [])

  useEffect(() => {
    let filtered = [...fliiinkers]

    if (filters.status !== 'all') {
      filtered = filtered.filter(f => f.fliiinkerProfile?.status === filters.status)
    }

    if (filters.isValidated !== 'all') {
      const isValidated = filters.isValidated === 'true'
      filtered = filtered.filter(f => f.fliiinkerProfile?.is_validated === isValidated)
    }

    if (filters.isPro !== 'all') {
      const isPro = filters.isPro === 'true'
      filtered = filtered.filter(f => f.fliiinkerProfile?.is_pro === isPro)
    }

    if (filters.verificationStatus !== 'all') {
      filtered = filtered.filter(f => f.administrativeData?.id_card_verification_status === filters.verificationStatus)
    }

    setFilteredFliiinkers(filtered)
  }, [filters, fliiinkers])

  const handleDecision = (fliiinkerId: string, action: DecisionAction) => {
    setDecisions(prev => ({
      ...prev,
      [fliiinkerId]: action
    }))
  }

  const handleViewDetails = (fliiinker: FliiinkerData) => {
    setSelectedFliiinker(fliiinker)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailModalOpen(false)
    setSelectedFliiinker(null)
  }

  const getStats = () => {
    const total = fliiinkers.length
    const approved = Object.values(decisions).filter(d => d === 'approve').length
    const rejected = Object.values(decisions).filter(d => d === 'reject').length
    const pending = total - approved - rejected
    
    return { total, approved, rejected, pending }
  }

  const tabs = [
    {
      id: 'list' as TabType,
      name: 'Liste des Fliiinkers',
      icon: List,
      count: fliiinkers.length
    },
    {
      id: 'statistics' as TabType,
      name: 'Statistiques avancées',
      icon: BarChart3,
      count: null
    },
    {
      id: 'map' as TabType,
      name: 'Carte globale',
      icon: Map,
      count: null
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Dashboard Fliiinker
            </h2>
            <p className="text-gray-600 mt-1">
              Chargement des profils éligibles...
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-600">Chargement des données...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Dashboard Fliiinker
            </h2>
            <p className="text-gray-600 mt-1">
              Erreur lors du chargement
            </p>
          </div>
        </div>
        
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-danger-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">
                Erreur de chargement
              </h3>
              <div className="mt-2 text-sm text-danger-700">
                <p>{error}</p>
                <p className="mt-2">
                  Veuillez vérifier votre configuration Supabase dans le fichier .env.local
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Dashboard Fliiinker
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez les profils éligibles et analysez les données
          </p>
        </div>
      </div>

      {/* Statistiques rapides globales */}
      <StatsOverview stats={getStats()} />

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 flex items-center space-x-2`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  {tab.count !== null && (
                    <span className={`${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    } ml-2 py-1 px-2 rounded-full text-xs font-semibold`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'list' && (
            <div className="space-y-6">
              <FilterBar filters={filters} onFiltersChange={setFilters} />

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredFliiinkers.map((fliiinker) => (
                  <FliiinkerCard
                    key={fliiinker.profile.id}
                    fliiinker={fliiinker}
                    decision={decisions[fliiinker.profile.id]}
                    onDecision={handleDecision}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {!loading && filteredFliiinkers.length === 0 && fliiinkers.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Aucun fliiinker ne correspond aux filtres sélectionnés
                  </p>
                </div>
              )}

              {!loading && fliiinkers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Aucun fliiinker éligible trouvé dans la base de données
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'statistics' && (
            <AdvancedStatistics fliiinkers={fliiinkers} />
          )}

          {activeTab === 'map' && (
            <GlobalFliiinkerMap fliiinkers={fliiinkers} height="700px" />
          )}
        </div>
      </div>

      {/* Modal de détail */}
      <FliiinkerDetailModal
        fliiinker={selectedFliiinker}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetails}
      />
    </div>
  )
} 