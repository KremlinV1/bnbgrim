import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'

async function getProperties() {
  const properties = await prisma.property.findMany({
    include: {
      images: {
        where: { isMain: true },
        take: 1
      },
      _count: {
        select: { amenities: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  // If no main image is found, fallback to the first image
  const propertiesWithImages = await Promise.all(properties.map(async (prop: any) => {
    if (prop.images.length === 0) {
      const fallbackImage = await prisma.image.findFirst({
        where: { propertyId: prop.id }
      })
      if (fallbackImage) {
        prop.images = [fallbackImage]
      }
    }
    return prop
  }))
  
  return propertiesWithImages
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const allProperties = await getProperties()
  
  // Basic client-side-like filtering for demo purposes
  const search = searchParams?.search?.toLowerCase() || ""
  const properties = search 
    ? allProperties.filter((p: any) => p.city.toLowerCase().includes(search) || p.title.toLowerCase().includes(search))
    : allProperties

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <Header />
        <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-12">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              {search ? `Search Results for "${search}"` : "Popular homes on WhereTo"}
            </h2>
            {!search && (
              <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-900 mt-1">
                <FaChevronRight className="text-sm" />
              </button>
            )}
          </div>
          
          {!search && (
            <div className="flex items-center gap-2 hidden sm:flex">
              <button className="p-2 border border-gray-300 rounded-full hover:shadow-md transition text-gray-400 opacity-50 cursor-not-allowed">
                <FaChevronLeft className="text-sm" />
              </button>
              <button className="p-2 border border-gray-300 rounded-full hover:shadow-md transition text-gray-900">
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          )}
        </div>
        
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
            {search && (
              <Link href="/" className="text-gray-900 font-semibold underline mt-4 block">
                Clear search
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {properties.map((property: any) => (
              <PropertyCard key={property.id} item={property} type="property" />
            ))}
            
            {/* "See all" card placeholder for demo */}
            <Link href="/" className="group cursor-pointer hidden xl:block">
              <div className="flex flex-col h-full items-center justify-center border border-gray-200 rounded-xl aspect-square hover:shadow-md transition">
                <span className="font-semibold text-gray-900">See all</span>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
