'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaChevronDown, FaMinus, FaPlus } from 'react-icons/fa'

interface BookingWidgetProps {
  price: number
  propertyId: string
}

export default function BookingWidget({ price, propertyId }: BookingWidgetProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [showDatePicker, setShowDatePicker] = useState<'checkin' | 'checkout' | null>(null)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 })
  
  const datePickerRef = useRef<HTMLDivElement>(null)
  const guestSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(null)
      }
      if (guestSectionRef.current && !guestSectionRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const totalGuests = guests.adults + guests.children

  const updateGuests = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
    setGuests(prev => {
      const newValue = increment ? prev[type] + 1 : prev[type] - 1
      if (type === 'adults' && newValue < 1) return prev
      if (newValue < 0) return prev
      if (type !== 'infants' && (prev.adults + prev.children + (type === 'adults' ? (increment ? 1 : -1) : 0) + (type === 'children' ? (increment ? 1 : -1) : 0)) > 16) return prev
      return { ...prev, [type]: newValue }
    })
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Add date'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates')
      return
    }
    const totalGuests = guests.adults + guests.children
    router.push(`/book/${propertyId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${totalGuests}`)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-xl sticky top-28">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-800 ml-1 text-base">night</span>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="border border-gray-400 rounded-lg relative" ref={datePickerRef}>
          <div className="grid grid-cols-2 border-b border-gray-400">
            <div 
              className="p-3 border-r border-gray-400 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => setShowDatePicker(showDatePicker === 'checkin' ? null : 'checkin')}
            >
              <label className="block text-[10px] font-bold uppercase text-gray-800">Check-in</label>
              <div className="mt-1 text-sm text-gray-800">{formatDate(checkIn)}</div>
            </div>
            <div 
              className="p-3 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => setShowDatePicker(showDatePicker === 'checkout' ? null : 'checkout')}
            >
              <label className="block text-[10px] font-bold uppercase text-gray-800">Checkout</label>
              <div className="mt-1 text-sm text-gray-800">{formatDate(checkOut)}</div>
            </div>
          </div>
          
          {/* Date Picker Dropdown */}
          {showDatePicker && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-20">
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-900">
                  {showDatePicker === 'checkin' ? 'Select check-in date' : 'Select checkout date'}
                </p>
              </div>
              <input
                type="date"
                min={showDatePicker === 'checkout' && checkIn ? checkIn : today}
                value={showDatePicker === 'checkin' ? checkIn : checkOut}
                onChange={(e) => {
                  if (showDatePicker === 'checkin') {
                    setCheckIn(e.target.value)
                    if (checkOut && e.target.value >= checkOut) {
                      setCheckOut('')
                    }
                    setShowDatePicker('checkout')
                  } else {
                    setCheckOut(e.target.value)
                    setShowDatePicker(null)
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg text-base"
              />
              <button
                onClick={() => setShowDatePicker(null)}
                className="mt-3 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>
          )}

          <div ref={guestSectionRef} className="relative">
            <div 
              className="p-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer transition"
              onClick={() => setShowGuestPicker(!showGuestPicker)}
            >
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-800">Guests</label>
                <div className="text-sm mt-1 text-gray-800">
                  {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                  {guests.infants > 0 && `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`}
                </div>
              </div>
              <FaChevronDown className={`text-gray-600 transition ${showGuestPicker ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Guest Picker Dropdown */}
            {showGuestPicker && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-20"
              >
                {/* Adults */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Adults</p>
                    <p className="text-sm text-gray-500">Age 13+</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuests('adults', false)}
                      disabled={guests.adults <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FaMinus className="text-xs text-gray-600" />
                    </button>
                    <span className="w-6 text-center font-medium">{guests.adults}</span>
                    <button
                      onClick={() => updateGuests('adults', true)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-600"
                    >
                      <FaPlus className="text-xs text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Children</p>
                    <p className="text-sm text-gray-500">Ages 2–12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuests('children', false)}
                      disabled={guests.children <= 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FaMinus className="text-xs text-gray-600" />
                    </button>
                    <span className="w-6 text-center font-medium">{guests.children}</span>
                    <button
                      onClick={() => updateGuests('children', true)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-600"
                    >
                      <FaPlus className="text-xs text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-gray-900">Infants</p>
                    <p className="text-sm text-gray-500">Under 2</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateGuests('infants', false)}
                      disabled={guests.infants <= 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <FaMinus className="text-xs text-gray-600" />
                    </button>
                    <span className="w-6 text-center font-medium">{guests.infants}</span>
                    <button
                      onClick={() => updateGuests('infants', true)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-600"
                    >
                      <FaPlus className="text-xs text-gray-600" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowGuestPicker(false)}
                  className="w-full mt-3 text-right text-sm font-semibold underline text-gray-900 hover:text-gray-600"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleReserve}
        className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-3.5 rounded-lg transition duration-200 text-lg"
      >
        Reserve
      </button>
      
      <p className="text-center text-gray-500 text-[13px] mt-4 font-medium">
        You won&apos;t be charged yet
      </p>

      {checkIn && checkOut && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <div className="flex justify-between text-base">
            <span className="underline text-gray-800">
              ${price} x {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
            </span>
            <span className="text-gray-800">
              ${price * Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
            </span>
          </div>
          <div className="flex justify-between text-base">
            <span className="underline text-gray-800">Cleaning fee</span>
            <span className="text-gray-800">$50</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="underline text-gray-800">Service fee</span>
            <span className="text-gray-800">$75</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-200">
            <span>Total before taxes</span>
            <span>
              ${price * Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) + 125}
            </span>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center border-t border-gray-200 pt-6">
        <button className="flex items-center gap-2 text-gray-600 underline font-medium text-sm hover:text-gray-900 transition">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}><path d="M28 6H17V3a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v23H4v2h24v-2h-2zm-10 0v20H8V3h7v3zm-4 8a1 1 0 1 1-1-1 1 1 0 0 1 1 1zm-3 7a1 1 0 1 1-1-1 1 1 0 0 1 1 1z"></path></svg>
          Report this listing
        </button>
      </div>
    </div>
  )
}
