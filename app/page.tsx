'use client'

import { useState, useEffect } from 'react'
import { FliiinkerData, DecisionAction } from '@/types/database'
import FliiinkerCard from '@/components/FliiinkerCard'
import SearchBar from '@/components/FilterBar'
import StatsOverview from '@/components/StatsOverview'
import FliiinkerDetailModal from '@/components/FliiinkerDetailModal'
import AdvancedStatistics from '@/components/AdvancedStatistics'
import { BarChart3, Users, Map, List, Activity } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Card, CardBody, Tabs, Tab, Spinner } from '@heroui/react'

// Import dynamique pour éviter les problèmes SSR avec Leaflet
const GlobalFliiinkerMap = dynamic(() => import('@/components/GlobalFliiinkerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[700px] bg-gray-50/30 rounded-2xl flex items-center justify-center border border-gray-100/50">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" color="default" />
        <p className="text-gray-500 text-sm font-light">Chargement de la carte globale...</p>
      </div>
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
  const [searchTerm, setSearchTerm] = useState('')

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
    if (!searchTerm.trim()) {
      setFilteredFliiinkers(fliiinkers)
      return
    }

    const filtered = fliiinkers.filter(fliiinker => {
      const firstName = fliiinker.profile.first_name || ''
      const lastName = fliiinker.profile.last_name || ''
      const fullName = `${firstName} ${lastName}`.toLowerCase()
      const search = searchTerm.toLowerCase().trim()
      
      return fullName.includes(search) || 
             firstName.toLowerCase().includes(search) ||
             lastName.toLowerCase().includes(search)
    })

    setFilteredFliiinkers(filtered)
  }, [searchTerm, fliiinkers])

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
    
    // Calculer le nombre total de services uniques
    const uniqueServices = new Set<number>()
    fliiinkers.forEach(fliiinker => {
      fliiinker.services.forEach(service => {
        uniqueServices.add(service.service_id)
      })
    })
    const totalServices = uniqueServices.size
    
    // Calculer le prix moyen global
    const allPrices = fliiinkers.flatMap(f => f.services.map(s => s.hourly_rate))
    const averagePrice = allPrices.length > 0 
      ? Math.round((allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length) * 100) / 100
      : 0
    
    // Calculer le rayon moyen global
    const allRadii = fliiinkers.flatMap(f => f.addressLocations.map(al => al.radius_max))
    const averageRadius = allRadii.length > 0 
      ? Math.round((allRadii.reduce((sum, radius) => sum + radius, 0) / allRadii.length) * 100) / 100
      : 0
    
    // Calculer le nombre de villes uniques
    const uniqueCities = new Set<string>()
    fliiinkers.forEach(fliiinker => {
      fliiinker.addresses.forEach(address => {
        if (address.city) {
          uniqueCities.add(address.city)
        }
      })
    })
    const totalCities = uniqueCities.size
    
    // Calculer le ratio de professionnels
    const professionals = fliiinkers.filter(f => f.fliiinkerProfile?.is_pro).length
    const professionalRatio = total > 0 ? Math.round((professionals / total) * 100) : 0
    
    return { 
      total, 
      totalServices, 
      averagePrice, 
      averageRadius, 
      totalCities, 
      professionalRatio 
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <Spinner size="lg" color="default" />
          </div>
          <h2 className="text-2xl font-light text-gray-600 mb-2">
            Chargement du dashboard
          </h2>
          <p className="text-gray-400 font-light">Analyse des données en cours...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-8 border border-red-100">
            <Activity className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            Connexion impossible
          </h2>
          <p className="text-gray-500 font-light max-w-md">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="w-[90%] mx-auto px-8 py-8">
        {/* Header Dashboard compact */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/logo.png"
                alt="Logo Plüm" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard Plüm</h1>
              <p className="text-gray-500 font-light">Gestion intelligente des profils Plüm</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/50 shadow-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">{fliiinkers.length} profils</span>
            <span className="text-xs text-gray-500">• En temps réel</span>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="mb-12 animate-slide-up">
          <StatsOverview stats={getStats()} />
        </div>

        {/* Navigation par onglets élégante */}
        <div className="animate-slide-up">
          <Card className="bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
            <CardBody className="p-0">
              <Tabs 
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as TabType)}
                variant="underlined"
                classNames={{
                  tabList: "gap-12 w-full relative rounded-none p-8 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/30 to-gray-50/10",
                  cursor: "w-full h-1 bg-apple-intelligence rounded-full",
                  tab: "max-w-fit px-0 py-4 h-auto",
                  tabContent: "group-data-[selected=true]:text-gray-900 font-medium text-gray-500 transition-all duration-300"
                }}
              >
                <Tab
                  key="list"
                  title={
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-data-[selected=true]:bg-apple-intelligence transition-all duration-300">
                        <List className="w-5 h-5 group-data-[selected=true]:text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Profils Fliiinker</div>
                        <div className="text-xs text-gray-400">{filteredFliiinkers.length} disponibles</div>
                      </div>
                    </div>
                  }
                >
                  <div className="p-8 space-y-8">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                      <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-light mb-6">
                          {searchTerm ? `Aucun profil trouvé pour "${searchTerm}"` : 'Aucun profil disponible'}
                        </p>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm('')}
                            className="text-gray-900 hover:text-gray-600 font-medium transition-colors"
                          >
                            Réinitialiser la recherche
                          </button>
                        )}
                      </div>
                    )}

                    {!loading && fliiinkers.length === 0 && (
                      <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-light">
                          Aucun profil disponible dans votre base de données
                        </p>
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab
                  key="statistics"
                  title={
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-data-[selected=true]:bg-apple-intelligence transition-all duration-300">
                        <BarChart3 className="w-5 h-5 group-data-[selected=true]:text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Statistiques</div>
                        <div className="text-xs text-gray-400">Analytics avancées</div>
                      </div>
                    </div>
                  }
                >
                  <div className="p-8">
                    <AdvancedStatistics fliiinkers={fliiinkers} />
                  </div>
                </Tab>

                <Tab
                  key="map"
                  title={
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-data-[selected=true]:bg-apple-intelligence transition-all duration-300">
                        <Map className="w-5 h-5 group-data-[selected=true]:text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Cartographie</div>
                        <div className="text-xs text-gray-400">Vue géographique</div>
                      </div>
                    </div>
                  }
                >
                  <div className="p-8">
                    <GlobalFliiinkerMap fliiinkers={fliiinkers} height="700px" />
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
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