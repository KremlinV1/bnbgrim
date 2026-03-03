'use client'

import { useState, useRef, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useRouter, useSearchParams } from 'next/navigation'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { format } from 'date-fns'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultSearch = searchParams.get('search') || ''

  const [searchQuery, setSearchQuery] = useState(defaultSearch)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false)
  
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const [guests, setGuests] = useState({ adults: 1, children: 0 })

  const datePickerRef = useRef<HTMLDivElement>(null)
  const guestPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false)
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setIsGuestPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    
    if (searchQuery) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push('/')
    }
    
    setIsDatePickerOpen(false)
    setIsGuestPickerOpen(false)
  }

  const handleDateChange = (item: any) => {
    setDateRange([item.selection])
  }

  const formatDates = () => {
    if (dateRange[0].startDate.getTime() === dateRange[0].endDate.getTime()) {
      return 'Add dates'
    }
    return `${format(dateRange[0].startDate, 'MMM d')} - ${format(dateRange[0].endDate, 'MMM d')}`
  }

  const totalGuests = guests.adults + guests.children

  return (
    <div className="flex justify-center -mt-6 relative z-40 mb-10 pb-4">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 flex items-center p-2 max-w-3xl w-full mx-4 relative">
        
        {/* Destination */}
        <div className="flex-1 px-6 py-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
          <div className="text-xs font-bold text-gray-900">Where</div>
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations" 
              className="w-full bg-transparent outline-none text-sm text-gray-600 truncate placeholder-gray-400"
            />
          </form>
        </div>
        
        <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
        
        {/* Dates */}
        <div 
          className="flex-1 px-6 py-2 hover:bg-gray-100 rounded-full transition cursor-pointer hidden sm:block relative"
          onClick={() => {
            setIsDatePickerOpen(!isDatePickerOpen)
            setIsGuestPickerOpen(false)
          }}
        >
          <div className="text-xs font-bold text-gray-900">When</div>
          <div className="text-sm text-gray-600 font-medium truncate">
            {formatDates()}
          </div>
          
          {isDatePickerOpen && (
            <div ref={datePickerRef} className="absolute top-16 left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-xl border border-gray-200 p-4" onClick={e => e.stopPropagation()}>
              <DateRange
                ranges={dateRange}
                onChange={handleDateChange}
                minDate={new Date()}
                rangeColors={['#FF385C']}
                showDateDisplay={false}
              />
            </div>
          )}
        </div>
        
        <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
        
        {/* Guests & Search Button */}
        <div className="flex-1 pl-6 pr-2 py-2 hover:bg-gray-100 rounded-full transition cursor-pointer flex items-center justify-between hidden md:flex relative">
          <div 
            className="flex-1"
            onClick={() => {
              setIsGuestPickerOpen(!isGuestPickerOpen)
              setIsDatePickerOpen(false)
            }}
          >
            <div className="text-xs font-bold text-gray-900">Who</div>
            <div className="text-sm text-gray-600 font-medium truncate">
              {totalGuests > 0 ? `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}` : 'Add guests'}
            </div>
            
            {isGuestPickerOpen && (
              <div ref={guestPickerRef} className="absolute top-16 right-0 bg-white rounded-3xl shadow-xl border border-gray-200 p-6 w-80" onClick={e => e.stopPropagation()}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">Adults</div>
                      <div className="text-sm text-gray-500">Ages 13 or above</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setGuests({...guests, adults: Math.max(1, guests.adults - 1)})}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800 text-gray-600 disabled:opacity-30"
                        disabled={guests.adults <= 1}
                      >-</button>
                      <span className="w-4 text-center">{guests.adults}</span>
                      <button 
                        onClick={() => setGuests({...guests, adults: guests.adults + 1})}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800 text-gray-600"
                      >+</button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200"></div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">Children</div>
                      <div className="text-sm text-gray-500">Ages 2-12</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setGuests({...guests, children: Math.max(0, guests.children - 1)})}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800 text-gray-600 disabled:opacity-30"
                        disabled={guests.children <= 0}
                      >-</button>
                      <span className="w-4 text-center">{guests.children}</span>
                      <button 
                        onClick={() => setGuests({...guests, children: guests.children + 1})}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-800 text-gray-600"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => handleSearch()}
            className="bg-[#FF385C] hover:bg-[#D90B38] text-white p-4 rounded-full transition ml-2 flex-shrink-0"
          >
            <FaSearch />
          </button>
        </div>
      </div>
    </div>
  )
}
