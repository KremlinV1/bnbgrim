'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../../../components/Header'
import { FaCheckCircle, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaEnvelope, FaPrint } from 'react-icons/fa'

interface Booking {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: string
  guestName: string
  guestEmail: string
  guestPhone: string | null
  createdAt: string
  property: {
    id: string
    title: string
    address: string
    city: string
    country: string
    images: { id: string; url: string; isMain: boolean }[]
  }
}

export default function BookingConfirmationPage() {
  const params = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setBooking(data.booking)
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id) {
      fetchBooking()
    }
  }, [params.id])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Booking not found</h1>
          <Link href="/" className="text-[#FF385C] font-medium">Go back home</Link>
        </div>
      </div>
    )
  }

  const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <Header />
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Your trip is booked!</h1>
          <p className="text-gray-600">
            Confirmation sent to <span className="font-medium">{booking.guestEmail}</span>
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Property Image Header */}
          <div className="relative h-48 bg-gray-200">
            {booking.property.images && booking.property.images[0] ? (
              <Image
                src={booking.property.images[0].url}
                alt={booking.property.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <h2 className="text-xl font-semibold">{booking.property.title}</h2>
              <p className="text-white/80 flex items-center gap-2 mt-1">
                <FaMapMarkerAlt className="text-sm" />
                {booking.property.city}, {booking.property.country}
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaCalendarAlt className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium">{formatShortDate(booking.checkIn)}</p>
                  <p className="text-sm text-gray-500">After 3:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaCalendarAlt className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium">{formatShortDate(booking.checkOut)}</p>
                  <p className="text-sm text-gray-500">Before 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaUsers className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium">{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</p>
                  <p className="text-sm text-gray-500">{nights} night{nights !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            <hr className="my-6" />

            {/* Payment Summary */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total paid</p>
                <p className="text-2xl font-semibold">${booking.totalPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Confirmation code</p>
                <p className="font-mono font-semibold text-lg">{booking.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">Guest details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name</span>
              <span className="font-medium">{booking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{booking.guestEmail}</span>
            </div>
            {booking.guestPhone && (
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">{booking.guestPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/properties/${booking.property.id}`}
            className="flex-1 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-3 px-6 rounded-lg transition text-center"
          >
            View property details
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <FaPrint />
            Print confirmation
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Need help? Contact us at <a href="mailto:support@whereto.com" className="text-[#FF385C]">support@whereto.com</a></p>
        </div>
      </main>
    </div>
  )
}
