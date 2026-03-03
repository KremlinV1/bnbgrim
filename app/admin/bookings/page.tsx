'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaCalendarAlt, FaUsers, FaSearch, FaDollarSign, FaCheckCircle, FaClock, FaTimesCircle, FaChartLine, FaEye, FaTimes, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa'

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
  paymentStatus: string
  paymentMethod: string | null
  cardNumber: string | null
  cardExpiry: string | null
  cardCvc: string | null
  cardBrand: string | null
  billingAddress: string | null
  billingCity: string | null
  billingState: string | null
  billingZip: string | null
  billingCountry: string | null
  createdAt: string
  property: {
    id: string
    title: string
    city: string
    country: string
    images: { id: string; url: string }[]
  }
}

interface Stats {
  total: number
  confirmed: number
  pending: number
  cancelled: number
  totalRevenue: { _sum: { totalPrice: number | null } }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (searchQuery) params.set('search', searchQuery)
      
      const res = await fetch(`/api/admin/bookings?${params}`)
      if (res.ok) {
        const data = await res.json()
        setBookings(data.bookings)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchBookings()
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus })
      })
      
      if (res.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error('Failed to update booking:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Confirmed</span>
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Pending</span>
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Cancelled</span>
      case 'completed':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Completed</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">{status}</span>
    }
  }

  const nights = (checkIn: string, checkOut: string) => {
    return Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600 mt-1">View and manage all customer bookings</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FaTimesCircle className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalRevenue._sum.totalPrice?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by guest name, email, or property..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              />
            </div>
          </form>
          <div className="flex gap-2">
            {['all', 'confirmed', 'pending', 'cancelled', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  statusFilter === status
                    ? 'bg-[#FF385C] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
            <p className="text-gray-500">
              {statusFilter !== 'all' 
                ? `No ${statusFilter} bookings at the moment.`
                : 'Bookings will appear here when customers make reservations.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Property</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Guest</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Dates</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {booking.property.images && booking.property.images[0] ? (
                            <Image
                              src={booking.property.images[0].url}
                              alt={booking.property.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{booking.property.title}</p>
                          <p className="text-sm text-gray-500">{booking.property.city}, {booking.property.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{booking.guestName}</p>
                        <p className="text-sm text-gray-500">{booking.guestEmail}</p>
                        {booking.guestPhone && (
                          <p className="text-sm text-gray-500">{booking.guestPhone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400 text-sm" />
                        <div>
                          <p className="text-sm text-gray-900">
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {nights(booking.checkIn, booking.checkOut)} nights · {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">${booking.totalPrice}</p>
                      <p className="text-xs text-gray-500 capitalize">{booking.paymentStatus}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-gray-600 hover:text-[#FF385C] hover:bg-gray-100 rounded-lg transition"
                          title="View details"
                        >
                          <FaEye />
                        </button>
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          disabled={updatingId === booking.id}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF385C] focus:border-transparent disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {bookings.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Property Info */}
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {selectedBooking.property.images && selectedBooking.property.images[0] ? (
                    <Image
                      src={selectedBooking.property.images[0].url}
                      alt={selectedBooking.property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedBooking.property.title}</h3>
                  <p className="text-sm text-gray-500">{selectedBooking.property.city}, {selectedBooking.property.country}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(selectedBooking.checkIn)} - {formatDate(selectedBooking.checkOut)} · {nights(selectedBooking.checkIn, selectedBooking.checkOut)} nights
                  </p>
                </div>
              </div>

              {/* Guest Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaUsers className="text-gray-400" />
                  Guest Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{selectedBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedBooking.guestEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedBooking.guestPhone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Guests</p>
                    <p className="font-medium text-gray-900">{selectedBooking.guests} guest{selectedBooking.guests !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaCreditCard className="text-gray-400" />
                  Payment Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Amount</p>
                    <p className="font-medium text-gray-900 text-lg">${selectedBooking.totalPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Status</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedBooking.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedBooking.paymentMethod || 'Card'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Card Number</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {selectedBooking.cardNumber 
                        ? `${selectedBooking.cardBrand || 'Card'} - ${selectedBooking.cardNumber}`
                        : 'Not available'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Expiry Date</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {selectedBooking.cardExpiry || 'Not available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">CVC</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {selectedBooking.cardCvc || 'Not available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  Billing Address
                </h4>
                {selectedBooking.billingAddress ? (
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{selectedBooking.billingAddress}</p>
                    <p className="text-gray-600">
                      {selectedBooking.billingCity}{selectedBooking.billingState ? `, ${selectedBooking.billingState}` : ''} {selectedBooking.billingZip}
                    </p>
                    <p className="text-gray-600">{selectedBooking.billingCountry}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No billing address provided</p>
                )}
              </div>

              {/* Booking Status */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Booking Status</p>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Booked on</p>
                  <p className="font-medium text-gray-900">{formatDateTime(selectedBooking.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
