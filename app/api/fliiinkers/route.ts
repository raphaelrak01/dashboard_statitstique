import { NextResponse } from 'next/server'
import { getEligibleFliiinkers, getFliiinkersStats } from '@/lib/fliiinkerService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const statsOnly = searchParams.get('stats') === 'true'

    if (statsOnly) {
      const stats = await getFliiinkersStats()
      return NextResponse.json(stats)
    }

    const fliiinkers = await getEligibleFliiinkers()
    
    return NextResponse.json({
      success: true,
      data: fliiinkers,
      count: fliiinkers.length
    })
    
  } catch (error) {
    console.error('Erreur API /api/fliiinkers:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur serveur',
        details: 'Vérifiez la configuration Supabase et la connectivité à la base de données'
      },
      { status: 500 }
    )
  }
} 