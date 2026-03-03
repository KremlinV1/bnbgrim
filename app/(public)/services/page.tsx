import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import Header from '../../components/Header'
import SearchBar from '../../components/SearchBar'
import PropertyCard from '../../components/PropertyCard'

async function getServices() {
  return await prisma.service.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <Header />
        <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Premium Services
            </h2>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200 mt-8">
            <h3 className="text-xl font-medium text-gray-900 mb-2">More services coming soon</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              From private chefs to chauffeur services, we are curating top-tier amenities to elevate your stay.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {services.map((service: any) => (
              <PropertyCard key={service.id} item={service} type="service" />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
