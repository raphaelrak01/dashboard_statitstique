import { FliiinkerData } from '@/types/database'

export interface ServiceStats {
  serviceId: number
  serviceName: string
  averagePrice: number
  highestPrice: number
  lowestPrice: number
  averageRadius: number
  fliiinkerCount: number
  highestPriceFliiinker: {
    id: string
    name: string
    price: number
  } | null
  lowestPriceFliiinker: {
    id: string
    name: string
    price: number
  } | null
}

export interface GlobalStats {
  totalFliiinkers: number
  averagePriceGlobal: number
  averageRadiusGlobal: number
  totalServices: number
  serviceStats: ServiceStats[]
  priceRanges: {
    range: string
    count: number
    percentage: number
  }[]
  radiusRanges: {
    range: string
    count: number
    percentage: number
  }[]
}

export function calculateFliiinkerStatistics(fliiinkers: FliiinkerData[]): GlobalStats {
  if (!fliiinkers.length) {
    return {
      totalFliiinkers: 0,
      averagePriceGlobal: 0,
      averageRadiusGlobal: 0,
      totalServices: 0,
      serviceStats: [],
      priceRanges: [],
      radiusRanges: []
    }
  }

  // Regrouper par service
  const serviceMap = new Map<number, {
    serviceId: number
    serviceName: string
    prices: { price: number, fliiinkerId: string, fliiinkerName: string }[]
    radii: number[]
  }>()

  // Collecter toutes les données
  fliiinkers.forEach(fliiinker => {
    fliiinker.services.forEach(service => {
      const serviceName = fliiinker.serviceDetails.find(sd => sd.id === service.service_id)?.name || `Service #${service.service_id}`
      
      if (!serviceMap.has(service.service_id)) {
        serviceMap.set(service.service_id, {
          serviceId: service.service_id,
          serviceName,
          prices: [],
          radii: []
        })
      }

      const serviceData = serviceMap.get(service.service_id)!
      serviceData.prices.push({
        price: service.hourly_rate,
        fliiinkerId: fliiinker.profile.id,
        fliiinkerName: `${fliiinker.profile.first_name} ${fliiinker.profile.last_name}`
      })

      // Ajouter les rayons depuis address_location
      fliiinker.addressLocations
        .filter(location => location.service_id === service.service_id)
        .forEach(location => {
          serviceData.radii.push(location.radius_max)
        })
    })
  })

  // Calculer les statistiques par service
  const serviceStats: ServiceStats[] = Array.from(serviceMap.values()).map(serviceData => {
    const prices = serviceData.prices.map(p => p.price)
    const radii = serviceData.radii
    
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const highestPrice = Math.max(...prices)
    const lowestPrice = Math.min(...prices)
    const averageRadius = radii.length > 0 ? radii.reduce((sum, radius) => sum + radius, 0) / radii.length : 0

    const highestPriceFliiinker = serviceData.prices.find(p => p.price === highestPrice)
    const lowestPriceFliiinker = serviceData.prices.find(p => p.price === lowestPrice)

    return {
      serviceId: serviceData.serviceId,
      serviceName: serviceData.serviceName,
      averagePrice: Math.round(averagePrice * 100) / 100,
      highestPrice,
      lowestPrice,
      averageRadius: Math.round(averageRadius * 100) / 100,
      fliiinkerCount: serviceData.prices.length,
      highestPriceFliiinker: highestPriceFliiinker ? {
        id: highestPriceFliiinker.fliiinkerId,
        name: highestPriceFliiinker.fliiinkerName,
        price: highestPriceFliiinker.price
      } : null,
      lowestPriceFliiinker: lowestPriceFliiinker ? {
        id: lowestPriceFliiinker.fliiinkerId,
        name: lowestPriceFliiinker.fliiinkerName,
        price: lowestPriceFliiinker.price
      } : null
    }
  })

  // Statistiques globales
  const allPrices = fliiinkers.flatMap(f => f.services.map(s => s.hourly_rate))
  const allRadii = fliiinkers.flatMap(f => f.addressLocations.map(al => al.radius_max))
  
  const averagePriceGlobal = allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
  const averageRadiusGlobal = allRadii.length > 0 ? allRadii.reduce((sum, radius) => sum + radius, 0) / allRadii.length : 0

  // Répartition des prix par tranches
  const priceRanges = [
    { range: '0-25€', min: 0, max: 25 },
    { range: '25-50€', min: 25, max: 50 },
    { range: '50-75€', min: 50, max: 75 },
    { range: '75-100€', min: 75, max: 100 },
    { range: '100€+', min: 100, max: Infinity }
  ].map(range => {
    const count = allPrices.filter(price => price >= range.min && price < range.max).length
    return {
      range: range.range,
      count,
      percentage: Math.round((count / allPrices.length) * 100)
    }
  })

  // Répartition des rayons par tranches
  const radiusRanges = [
    { range: '0-5km', min: 0, max: 5 },
    { range: '5-10km', min: 5, max: 10 },
    { range: '10-20km', min: 10, max: 20 },
    { range: '20-50km', min: 20, max: 50 },
    { range: '50km+', min: 50, max: Infinity }
  ].map(range => {
    const count = allRadii.filter(radius => radius >= range.min && radius < range.max).length
    return {
      range: range.range,
      count,
      percentage: allRadii.length > 0 ? Math.round((count / allRadii.length) * 100) : 0
    }
  })

  return {
    totalFliiinkers: fliiinkers.length,
    averagePriceGlobal: Math.round(averagePriceGlobal * 100) / 100,
    averageRadiusGlobal: Math.round(averageRadiusGlobal * 100) / 100,
    totalServices: serviceStats.length,
    serviceStats: serviceStats.sort((a, b) => b.averagePrice - a.averagePrice),
    priceRanges,
    radiusRanges
  }
}

export function getTopFliiinkersByService(fliiinkers: FliiinkerData[], limit = 3) {
  const serviceMap = new Map<number, {
    serviceName: string
    fliiinkers: { name: string, price: number, id: string }[]
  }>()

  fliiinkers.forEach(fliiinker => {
    fliiinker.services.forEach(service => {
      const serviceName = fliiinker.serviceDetails.find(sd => sd.id === service.service_id)?.name || `Service #${service.service_id}`
      
      if (!serviceMap.has(service.service_id)) {
        serviceMap.set(service.service_id, {
          serviceName,
          fliiinkers: []
        })
      }

      serviceMap.get(service.service_id)!.fliiinkers.push({
        name: `${fliiinker.profile.first_name} ${fliiinker.profile.last_name}`,
        price: service.hourly_rate,
        id: fliiinker.profile.id
      })
    })
  })

  return Array.from(serviceMap.entries()).map(([serviceId, data]) => ({
    serviceId,
    serviceName: data.serviceName,
    topFliiinkers: data.fliiinkers
      .sort((a, b) => b.price - a.price)
      .slice(0, limit)
  }))
} 