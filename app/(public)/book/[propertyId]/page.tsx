'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../../components/Header'
import { FaStar, FaChevronLeft, FaCreditCard, FaLock } from 'react-icons/fa'

interface Property {
  id: string
  title: string
  price: number
  city: string
  country: string
  images: { id: string; url: string; isMain: boolean }[]
}

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  // Get booking details from URL params
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = parseInt(searchParams.get('guests') || '1')
  
  // Form state
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')
  
  // Billing address state
  const [billingAddress, setBillingAddress] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingState, setBillingState] = useState('')
  const [billingZip, setBillingZip] = useState('')
  const [billingCountry, setBillingCountry] = useState('United States')

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${params.propertyId}`)
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
    
    if (params.propertyId) {
      fetchProperty()
    }
  }, [params.propertyId])

  if (!checkIn || !checkOut) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Missing booking details</h1>
          <p className="text-gray-600 mb-6">Please select dates from the property page.</p>
          <Link href={`/properties/${params.propertyId}`} className="text-[#FF385C] font-medium">
            Go back to property
          </Link>
        </div>
      </div>
    )
  }

  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  const nightlyTotal = property ? property.price * nights : 0
  const cleaningFee = 50
  const serviceFee = 75
  const totalPrice = nightlyTotal + cleaningFee + serviceFee

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // Basic validation
    if (!guestName || !guestEmail || !cardNumber || !cardExpiry || !cardCvc) {
      setError('Please fill in all required fields')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: params.propertyId,
          checkIn,
          checkOut,
          guests,
          totalPrice,
          guestName,
          guestEmail,
          guestPhone,
          paymentMethod: 'card',
          cardNumber,
          cardExpiry,
          cardCvc,
          billingAddress,
          billingCity,
          billingState,
          billingZip,
          billingCountry
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }

      // Redirect to confirmation page
      router.push(`/booking/confirmation/${data.booking.id}`)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Property not found</h1>
          <Link href="/" className="text-[#FF385C] font-medium">Go back home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <Header />
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href={`/properties/${params.propertyId}`}
          className="inline-flex items-center gap-2 text-gray-900 hover:underline mb-8"
        >
          <FaChevronLeft className="text-sm" />
          <span className="font-medium">Back to property</span>
        </Link>

        <h1 className="text-3xl font-semibold mb-8">Confirm and pay</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div>
            {/* Trip Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Your trip</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Dates</p>
                    <p className="text-gray-600">{formatDate(checkIn)} – {formatDate(checkOut)}</p>
                  </div>
                  <Link href={`/properties/${params.propertyId}`} className="text-[#FF385C] font-medium underline">
                    Edit
                  </Link>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Guests</p>
                    <p className="text-gray-600">{guests} guest{guests !== 1 ? 's' : ''}</p>
                  </div>
                  <Link href={`/properties/${params.propertyId}`} className="text-[#FF385C] font-medium underline">
                    Edit
                  </Link>
                </div>
              </div>
            </div>

            <hr className="my-8" />

            {/* Guest Information */}
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Guest information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email address *</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone number (optional)</label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <hr className="my-8" />

              {/* Payment */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Pay with</h2>
                  <div className="flex items-center gap-2">
                    <FaLock className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-500">Secure payment</span>
                  </div>
                </div>
                
                <div className="border border-gray-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <FaCreditCard className="text-gray-600 text-xl" />
                    <span className="font-medium">Credit or debit card</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card number *</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiration *</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 4)
                            if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2)
                            setCardExpiry(val)
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC *</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    {/* Billing Address */}
                    <div className="pt-4 border-t border-gray-200 mt-4">
                      <p className="font-medium text-gray-900 mb-4">Billing address</p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street address *</label>
                          <input
                            type="text"
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                            placeholder="123 Main Street"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input
                              type="text"
                              value={billingCity}
                              onChange={(e) => setBillingCity(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                              placeholder="New York"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
                            <input
                              type="text"
                              value={billingState}
                              onChange={(e) => setBillingState(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                              placeholder="NY"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal code *</label>
                            <input
                              type="text"
                              value={billingZip}
                              onChange={(e) => setBillingZip(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                              placeholder="10001"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country/Region *</label>
                            <select
                              value={billingCountry}
                              onChange={(e) => setBillingCountry(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent bg-white"
                              required
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Australia">Australia</option>
                              <option value="Germany">Germany</option>
                              <option value="France">France</option>
                              <option value="Spain">Spain</option>
                              <option value="Italy">Italy</option>
                              <option value="Japan">Japan</option>
                              <option value="Mexico">Mexico</option>
                              <option value="Brazil">Brazil</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-8" />

              {/* Cancellation Policy */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Cancellation policy</h2>
                <p className="text-gray-600">
                  Free cancellation before {formatDate(checkIn)}. Cancel before check-in for a partial refund.
                </p>
              </div>

              <hr className="my-8" />

              {/* Terms */}
              <p className="text-sm text-gray-500 mb-6">
                By selecting the button below, I agree to the Host&apos;s House Rules, Ground rules for guests, 
                WhereTo&apos;s Rebooking and Refund Policy, and that WhereTo can charge my payment method if 
                I&apos;m responsible for damage.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-4 rounded-lg transition duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Processing...' : `Confirm and pay $${totalPrice}`}
              </button>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div className="border border-gray-200 rounded-xl p-6 sticky top-8">
              {/* Property Card */}
              <div className="flex gap-4 pb-6 border-b border-gray-200">
                <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  {property.images && property.images[0] ? (
                    <Image
                      src={property.images[0].url}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">Entire rental unit</p>
                  <p className="font-medium truncate">{property.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <FaStar className="text-xs" />
                    <span className="text-sm">4.85</span>
                    <span className="text-sm text-gray-500">(128 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="py-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Price details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="underline text-gray-800">${property.price} x {nights} night{nights !== 1 ? 's' : ''}</span>
                    <span>${nightlyTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline text-gray-800">Cleaning fee</span>
                    <span>${cleaningFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline text-gray-800">Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total (USD)</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
