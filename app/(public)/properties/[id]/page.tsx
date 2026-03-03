'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaStar, FaShare, FaHeart, FaUserCircle, FaDoorOpen } from 'react-icons/fa'
import Header from '../../../components/Header'
import PhotoGalleryModal from '../../../components/PhotoGalleryModal'
import BookingWidget from '../../../components/BookingWidget'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Property {
  id: string
  title: string
  description: string
  price: number
  city: string
  country: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  hostName: string
  images: { id: string; url: string; isMain: boolean }[]
  amenities: { id: string; name: string }[]
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [fakeRating] = useState((Math.random() * (5 - 4.5) + 4.5).toFixed(2))
  const [fakeReviews] = useState(Math.floor(Math.random() * 300) + 50)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryStartIndex, setGalleryStartIndex] = useState(0)

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setProperty(data.property)
        }
      } catch (error) {
        console.error('Failed to fetch property:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-200">
          <Header />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-[460px] bg-gray-200 rounded-xl mb-10"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-200">
          <Header />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Property not found</h1>
          <Link href="/" className="text-[#FF385C] mt-4 inline-block">Go back home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">
        {/* Title Section */}
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-[26px] font-semibold text-gray-900 leading-tight tracking-tight">
            {property.title}
          </h1>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-sm font-medium underline hover:bg-gray-50 px-3 py-2 rounded-lg transition">
              <FaShare className="text-gray-900" /> Share
            </button>
            <button className="flex items-center gap-2 text-sm font-medium underline hover:bg-gray-50 px-3 py-2 rounded-lg transition">
              <FaHeart className="text-gray-900" /> Save
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-10 h-[400px] md:h-[460px] rounded-xl overflow-hidden relative">
          <div 
            className="relative h-full w-full bg-gray-200 group cursor-pointer"
            onClick={() => { setGalleryStartIndex(0); setShowGallery(true); }}
          >
            {property.images.length > 0 ? (
              <Image
                src={property.images[0].url}
                alt={`${property.title} main image`}
                fill
                className="object-cover group-hover:opacity-90 transition"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No images available
              </div>
            )}
          </div>
          
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {property.images.slice(1, 5).map((img: any, idx: number) => (
              <div 
                key={img.id} 
                className="relative h-full w-full bg-gray-200 group cursor-pointer"
                onClick={() => { setGalleryStartIndex(idx + 1); setShowGallery(true); }}
              >
                <Image
                  src={img.url}
                  alt={`${property.title} image ${idx + 2}`}
                  fill
                  className="object-cover group-hover:opacity-90 transition"
                />
              </div>
            ))}
            {property.images.length < 5 && Array.from({ length: 5 - Math.max(1, property.images.length) }).map((_, idx) => (
              <div key={`empty-${idx}`} className="relative h-full w-full bg-gray-100" />
            ))}
          </div>
          
          <button 
            onClick={() => { setGalleryStartIndex(0); setShowGallery(true); }}
            className="absolute bottom-6 right-6 bg-white border border-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
          >
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}><path fillRule="evenodd" d="M3 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"></path></svg>
            Show all photos
          </button>
        </div>

        {/* Photo Gallery Modal */}
        <PhotoGalleryModal
          images={property.images}
          isOpen={showGallery}
          onClose={() => setShowGallery(false)}
          initialIndex={galleryStartIndex}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Info */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-[22px] font-semibold mb-1">Entire condo in {property.city}, {property.country}</h2>
              <div className="flex items-center text-[15px] text-gray-900 gap-1 mb-2">
                <span>{property.maxGuests} guests</span>
                <span>·</span>
                <span>{property.bedrooms} bedroom{property.bedrooms !== 1 && 's'}</span>
                <span>·</span>
                <span>{property.bedrooms > 1 ? property.bedrooms : 2} beds</span>
                <span>·</span>
                <span>{property.bathrooms} bath{property.bathrooms !== 1 && 's'}</span>
              </div>
              <div className="flex items-center text-[15px] font-semibold gap-2 mt-2">
                <FaStar className="text-xs" />
                <span>{fakeRating}</span>
                <span className="underline cursor-pointer hover:text-gray-600">{fakeReviews} reviews</span>
              </div>
            </div>

            {/* Host Section */}
            <div className="border-b border-gray-200 pb-6 flex items-center gap-4">
              <FaUserCircle className="text-5xl text-gray-400" />
              <div>
                <h3 className="font-semibold text-base">Hosted by {property.hostName}</h3>
                <p className="text-gray-500 text-sm">Superhost · 4 years hosting</p>
              </div>
            </div>

            {/* Features */}
            <div className="border-b border-gray-200 pb-6 space-y-6">
              <div className="flex gap-4">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '24px', width: '24px', fill: 'currentcolor' }}><path d="M26 2a1 1 0 0 1 .993.883L27 3v26a1 1 0 0 1-1.993.117L25 29H7a1 1 0 0 1-.993-.883L6 28V3a1 1 0 0 1 1.993-.117L8 3h18zM15 15v4H9v-4h6zm10 0h-8v4h8v-4zM25 5H7v8h18V5z"></path></svg>
                <div>
                  <h3 className="font-semibold">Amazing outdoor space</h3>
                  <p className="text-gray-500 text-sm">Guests mention the pool and patio as highlights.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '24px', width: '24px', fill: 'currentcolor' }}><path d="m20.333 19.502 4.167 4.164a2 2 0 0 1 -2.71 2.923l-.118-.1-4.165-4.166a9.006 9.006 0 0 1 -13.064-11.458 1.921 1.921 0 0 1 1.054-.93l12.433-4.143a1.92 1.92 0 0 1 2.228.796l1.246 1.868a2 2 0 0 1 -.332 2.502l-1.616 1.617a8.97 8.97 0 0 1 .877 6.927zm-1.895-10.37-9.426 3.142a7.006 7.006 0 0 0 9.873 8.358l3.123-3.123a7.036 7.036 0 0 0 -.47-9.877zm3.176 1.572 1.135-1.134-.73-1.094-11.231 3.743 1.189 1.188 8.016-2.672z"></path></svg>
                <div>
                  <h3 className="font-semibold">Designed for staying cool</h3>
                  <p className="text-gray-500 text-sm">Beat the heat with the AC and ceiling fan.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <FaDoorOpen className="text-2xl" />
                <div>
                  <h3 className="font-semibold">Self check-in</h3>
                  <p className="text-gray-500 text-sm">Check yourself in with the smartlock.</p>
                </div>
              </div>
            </div>

            {/* Translation notice */}
            <div className="bg-gray-100 p-4 rounded-lg flex items-center text-sm">
              <span>Some info has been automatically translated. </span>
              <span className="font-semibold underline ml-1 cursor-pointer">Show original</span>
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 pb-8">
              <div className="prose max-w-none text-gray-800 whitespace-pre-line text-base leading-relaxed">
                {property.description}
              </div>
              <button className="font-semibold underline mt-6 hover:text-gray-600 transition flex items-center gap-1">
                Show more
              </button>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <BookingWidget price={property.price} propertyId={property.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
