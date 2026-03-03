'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt } from 'react-icons/fa'

interface Booking {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: string
  guestName: string
  guestEmail: string
  createdAt: string
  property: {
    id: string
    title: string
    city: string
    country: string
    images: { id: string; url: string; isMain: boolean }[]
  }
}

export default function TripsPage() {
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [searchedEmail, setSearchedEmail] = useState('')

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetchBookings(session.user.email)
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status, session])

  const fetchBookings = async (emailToSearch: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(emailToSearch)}`)
      if (res.ok) {
        const data = await res.json()
        setBookings(data.bookings || [])
        setSearchedEmail(emailToSearch)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      fetchBookings(email)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const upcomingBookings = bookings.filter(b => new Date(b.checkIn) >= new Date() && b.status !== 'cancelled')
  const pastBookings = bookings.filter(b => new Date(b.checkIn) < new Date() || b.status === 'cancelled')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <Header />
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">Your trips</h1>

        {/* Search by email for non-logged in users */}
        {status === 'unauthenticated' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Find your bookings</h2>
            <p className="text-gray-600 mb-4">Enter the email address you used when booking to view your trips.</p>
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex gap-6">
                  <div className="w-40 h-28 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No trips found</h2>
            <p className="text-gray-600 mb-6">
              {searchedEmail 
                ? `No bookings found for ${searchedEmail}`
                : "When you book a trip, it will appear here."
              }
            </p>
            <Link
              href="/"
              className="inline-block bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Trips */}
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Upcoming trips</h2>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} formatDate={formatDate} getStatusColor={getStatusColor} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Trips */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Past trips</h2>
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} formatDate={formatDate} getStatusColor={getStatusColor} isPast />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function BookingCard({ 
  booking, 
  formatDate, 
  getStatusColor,
  isPast = false 
}: { 
  booking: Booking
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  isPast?: boolean
}) {
  const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Link 
      href={`/booking/confirmation/${booking.id}`}
      className={`block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition ${isPast ? 'opacity-75' : ''}`}
    >
      <div className="flex gap-6">
        {/* Image */}
        <div className="relative w-40 h-28 rounded-lg overflow-hidden flex-shrink-0">
          {booking.property.images && booking.property.images[0] ? (
            <Image
              src={booking.property.images[0].url}
              alt={booking.property.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg truncate">{booking.property.title}</h3>
              <p className="text-gray-500 flex items-center gap-1 mt-1">
                <FaMapMarkerAlt className="text-xs" />
                {booking.property.city}, {booking.property.country}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>

          <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers />
              <span>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
            </div>
            <div className="font-semibold text-gray-900">
              ${booking.totalPrice}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
