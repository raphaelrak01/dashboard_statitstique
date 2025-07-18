import { supabase } from './supabase'
import { FliiinkerData } from '@/types/database'

// Liste des IDs exclus
const EXCLUDED_IDS = [
  '54328bd9-7e9b-40c9-9db8-f30605e61697',
  '660a1a02-4947-49bf-9597-159f1fdde7aa',
  '350a4dfd-6b8b-40a5-828c-7eb719a2ddae',
  '1743223c-2ed2-4893-b8dc-c703c001dbd0',
  '4acf64ca-eb7a-4a79-96d1-5737dcf2ed2d',
  '1c47eb6c-e7de-4c8b-bfbb-f5a2cdfc4029',
  '98bbd53b-939d-4632-86f6-be3eec9e133b',
  '5e9b57c6-3a50-4e2b-94a2-5c6201b77437',
  '70f7e471-038c-450c-8c24-549dfdaf6c0c',
  'cdb06f3b-2d31-49e5-a3a2-a727f5a799d7',
  '6fbcf84b-de8a-4237-8118-9817bac80c30',
  '78c8c2ee-d25d-44e4-9356-c7e16a918d9f',
  '03561bcf-a026-44ed-9fec-562e819d4733',
  'ed4daab6-bb75-41ed-9188-1ed3fa94233e',
  '55c89c86-95e2-49d3-b3a4-a9541ddebaf4',
  '13a13f5c-fb8d-4b96-a6df-0a80deae5a88',
  'ef763d70-80bc-49fb-80e8-aacdcaf1ee95',
  '7ffecd68-2716-4a31-8daf-b5781521a4ac'
]

export async function getEligibleFliiinkers(): Promise<FliiinkerData[]> {
  try {
    console.log('Récupération des fliiinkers éligibles...')

    // 1. Récupérer les profils publics éligibles
    const { data: publicProfiles, error: profileError } = await supabase
      .from('public_profile')
      .select('*')
      .eq('is_fliiinker', true)
      .not('id', 'in', `(${EXCLUDED_IDS.map(id => `"${id}"`).join(',')})`)

    if (profileError) {
      console.error('Erreur lors de la récupération des profils publics:', profileError)
      throw profileError
    }

    if (!publicProfiles || publicProfiles.length === 0) {
      console.log('Aucun profil éligible trouvé')
      return []
    }

    console.log(`${publicProfiles.length} profils éligibles trouvés`)

    // 2. Récupérer tous les profils fliiinker associés
    const profileIds = publicProfiles.map(p => p.id)
    
    const { data: fliiinkerProfiles, error: fliiinkerError } = await supabase
      .from('fliiinker_profile')
      .select('*')
      .in('id', profileIds)

    if (fliiinkerError) {
      console.error('Erreur lors de la récupération des profils fliiinker:', fliiinkerError)
    }

    // 3. Récupérer les services
    const { data: services, error: servicesError } = await supabase
      .from('fliiinker_service_mtm')
      .select('*')
      .in('fliiinker_id', profileIds)

    if (servicesError) {
      console.error('Erreur lors de la récupération des services:', servicesError)
    }

    // 4. Récupérer les adresses
    const { data: addresses, error: addressesError } = await supabase
      .from('address')
      .select('*')
      .in('user_id', profileIds)

    if (addressesError) {
      console.error('Erreur lors de la récupération des adresses:', addressesError)
    }

    // 5. Récupérer les données administratives
    const { data: adminData, error: adminError } = await supabase
      .from('administrative_data')
      .select('*')
      .in('public_profile_id', profileIds)

    if (adminError) {
      console.error('Erreur lors de la récupération des données administratives:', adminError)
    }

    // 6. Récupérer les localisations d'adresses
    const { data: addressLocations, error: locationsError } = await supabase
      .from('address_location')
      .select('*')
      .in('user_id', profileIds)

    if (locationsError) {
      console.error('Erreur lors de la récupération des localisations:', locationsError)
    }

    // 7. Récupérer les détails des services
    const serviceIds = services?.map(s => s.service_id) || []
    let serviceDetails = []
    
    if (serviceIds.length > 0) {
      const { data: servicesData, error: serviceDetailsError } = await supabase
        .from('service')
        .select('*')
        .in('id', serviceIds)

      if (serviceDetailsError) {
        console.error('Erreur lors de la récupération des détails des services:', serviceDetailsError)
      } else {
        serviceDetails = servicesData || []
      }
    }

    // 8. Assembler les données
    const fliiinkersData: FliiinkerData[] = publicProfiles.map(profile => {
      const fliiinkerProfile = fliiinkerProfiles?.find(fp => fp.id === profile.id)
      const userServices = services?.filter(s => s.fliiinker_id === profile.id) || []
      const userAddresses = addresses?.filter(a => a.user_id === profile.id) || []
      const userAdminData = adminData?.find(ad => ad.public_profile_id === profile.id)
      const userLocations = addressLocations?.filter(al => al.user_id === profile.id) || []
      
      // Récupérer les détails des services pour cet utilisateur
      const userServiceIds = userServices.map(s => s.service_id)
      const userServiceDetails = serviceDetails?.filter(sd => userServiceIds.includes(sd.id)) || []

      return {
        profile,
        fliiinkerProfile,
        services: userServices,
        serviceDetails: userServiceDetails,
        addresses: userAddresses,
        administrativeData: userAdminData,
        addressLocations: userLocations
      }
    })

    console.log(`Données assemblées pour ${fliiinkersData.length} fliiinkers`)
    return fliiinkersData

  } catch (error) {
    console.error('Erreur lors de la récupération des fliiinkers:', error)
    throw error
  }
}

export async function getFliiinkerById(id: string): Promise<FliiinkerData | null> {
  try {
    // Vérifier si l'ID n'est pas dans la liste d'exclusion
    if (EXCLUDED_IDS.includes(id)) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('public_profile')
      .select('*')
      .eq('id', id)
      .eq('is_fliiinker', true)
      .single()

    if (profileError || !profile) {
      return null
    }

    // Récupérer toutes les données associées
    const [
      { data: fliiinkerProfile },
      { data: services },
      { data: addresses },
      { data: adminData },
      { data: addressLocations }
    ] = await Promise.all([
      supabase.from('fliiinker_profile').select('*').eq('id', id).single(),
      supabase.from('fliiinker_service_mtm').select('*').eq('fliiinker_id', id),
      supabase.from('address').select('*').eq('user_id', id),
      supabase.from('administrative_data').select('*').eq('public_profile_id', id).single(),
      supabase.from('address_location').select('*').eq('user_id', id)
    ])

    // Récupérer les détails des services
    const serviceIds = services?.map(s => s.service_id) || []
    let serviceDetails = []
    
    if (serviceIds.length > 0) {
      const { data: servicesData } = await supabase
        .from('service')
        .select('*')
        .in('id', serviceIds)
      
      serviceDetails = servicesData || []
    }

    return {
      profile,
      fliiinkerProfile: fliiinkerProfile || undefined,
      services: services || [],
      serviceDetails: serviceDetails,
      addresses: addresses || [],
      administrativeData: adminData || undefined,
      addressLocations: addressLocations || []
    }

  } catch (error) {
    console.error(`Erreur lors de la récupération du fliiinker ${id}:`, error)
    return null
  }
}

export async function getFliiinkersStats() {
  try {
    const { count, error } = await supabase
      .from('public_profile')
      .select('*', { count: 'exact', head: true })
      .eq('is_fliiinker', true)
      .not('id', 'in', `(${EXCLUDED_IDS.map(id => `"${id}"`).join(',')})`)

    if (error) {
      console.error('Erreur lors du calcul des statistiques:', error)
      return { total: 0 }
    }

    return { total: count || 0 }
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error)
    return { total: 0 }
  }
} 