import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      propertyId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      guestName,
      guestEmail,
      guestPhone,
      paymentMethod,
      cardNumber,
      cardExpiry,
      cardCvc,
      billingAddress,
      billingCity,
      billingState,
      billingZip,
      billingCountry
    } = body

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !guests || !totalPrice || !guestName || !guestEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: { in: ['pending', 'confirmed'] },
        OR: [
          {
            AND: [
              { checkIn: { lte: new Date(checkIn) } },
              { checkOut: { gt: new Date(checkIn) } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: new Date(checkOut) } },
              { checkOut: { gte: new Date(checkOut) } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: new Date(checkIn) } },
              { checkOut: { lte: new Date(checkOut) } }
            ]
          }
        ]
      }
    })

    if (overlappingBooking) {
      return NextResponse.json(
        { error: 'Property is not available for the selected dates' },
        { status: 409 }
      )
    }

    // Get user session if logged in - verify user exists before linking
    const session = await getServerSession(authOptions)
    let userId = null
    
    const sessionUserId = (session?.user as { id?: string })?.id
    if (sessionUserId) {
      const userExists = await prisma.user.findUnique({
        where: { id: sessionUserId }
      })
      if (userExists) {
        userId = sessionUserId
      }
    }

    // Validate card number using Luhn algorithm
    const validateCardNumber = (num: string): boolean => {
      if (!num || num.length < 13 || num.length > 19) return false
      let sum = 0
      let isEven = false
      for (let i = num.length - 1; i >= 0; i--) {
        let digit = parseInt(num[i], 10)
        if (isEven) {
          digit *= 2
          if (digit > 9) digit -= 9
        }
        sum += digit
        isEven = !isEven
      }
      return sum % 10 === 0
    }

    // Validate expiry date (must be in future)
    const validateExpiry = (expiry: string): boolean => {
      if (!expiry || !expiry.includes('/')) return false
      const [month, year] = expiry.split('/')
      const expMonth = parseInt(month, 10)
      const expYear = parseInt('20' + year, 10)
      if (expMonth < 1 || expMonth > 12) return false
      const now = new Date()
      const expDate = new Date(expYear, expMonth, 0) // Last day of expiry month
      return expDate >= now
    }

    // Validate CVC (3-4 digits)
    const validateCvc = (cvc: string): boolean => {
      return !!cvc && /^\d{3,4}$/.test(cvc)
    }

    // Perform card validations
    if (cardNumber && !validateCardNumber(cardNumber)) {
      return NextResponse.json(
        { error: 'Invalid card number. Please check and try again.' },
        { status: 400 }
      )
    }

    if (cardExpiry && !validateExpiry(cardExpiry)) {
      return NextResponse.json(
        { error: 'Card has expired or expiry date is invalid.' },
        { status: 400 }
      )
    }

    if (cardCvc && !validateCvc(cardCvc)) {
      return NextResponse.json(
        { error: 'Invalid CVC. Must be 3-4 digits.' },
        { status: 400 }
      )
    }

    // Detect card brand from first digit
    let cardBrand = null
    if (cardNumber) {
      if (cardNumber.startsWith('4')) cardBrand = 'Visa'
      else if (cardNumber.startsWith('5')) cardBrand = 'Mastercard'
      else if (cardNumber.startsWith('3')) cardBrand = 'Amex'
      else if (cardNumber.startsWith('6')) cardBrand = 'Discover'
      else cardBrand = 'Card'
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        totalPrice,
        guestName,
        guestEmail,
        guestPhone: guestPhone || null,
        paymentMethod: paymentMethod || 'card',
        paymentStatus: 'paid', // Mock payment success
        status: 'confirmed',
        cardNumber: cardNumber || null,
        cardExpiry: cardExpiry || null,
        cardCvc: cardCvc || null,
        cardBrand,
        billingAddress: billingAddress || null,
        billingCity: billingCity || null,
        billingState: billingState || null,
        billingZip: billingZip || null,
        billingCountry: billingCountry || null,
        ...(userId && { userId })
      },
      include: {
        property: {
          include: {
            images: {
              where: { isMain: true },
              take: 1
            }
          }
        }
      }
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error: any) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    // Get bookings for the user
    const userIdFromSession = (session.user as { id?: string })?.id
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { userId: userIdFromSession },
          { guestEmail: email || session.user.email }
        ]
      },
      include: {
        property: {
          include: {
            images: {
              where: { isMain: true },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
