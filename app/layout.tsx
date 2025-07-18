import './globals.css'
import { Inter } from 'next/font/google'
import { HeroUIProvider } from '@heroui/react'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter'
})

export const metadata = {
  title: 'Dashboard Fliiinker',
  description: 'Interface de gestion des profils Fliiinker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} font-apple`}>
      <body className="bg-white text-gray-900 font-light antialiased">
        <HeroUIProvider>
          <div className="min-h-screen bg-white">
            {/* Navigation Apple ultra-fine */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
              <div className="max-w-6xl mx-auto px-8">
                <div className="flex justify-between items-center h-12">
                  {/* Logo minimaliste */}
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-apple-intelligence flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 3L4 14h6l-2 7 9-11h-6l2-7z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Dashboard</span>
                  </div>
                  
                  {/* Status discret */}
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </nav>

            {/* Contenu principal avec beaucoup d'espace */}
            <main className="pt-12">
              {children}
            </main>

            {/* Footer minimaliste */}
            <footer className="mt-32 pb-16">
              <div className="max-w-6xl mx-auto px-8">
                <div className="border-t border-gray-100 pt-8">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-light">
                      © 2024 Dashboard Plüm. Designed by RAKOTONAIVO Aina Raphaël.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </HeroUIProvider>
      </body>
    </html>
  )
} 