import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { guestName: { contains: search, mode: 'insensitive' } },
        { guestEmail: { contains: search, mode: 'insensitive' } },
        { property: { title: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            country: true,
            images: {
              where: { isMain: true },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get stats
    const stats = {
      total: await prisma.booking.count(),
      confirmed: await prisma.booking.count({ where: { status: 'confirmed' } }),
      pending: await prisma.booking.count({ where: { status: 'pending' } }),
      cancelled: await prisma.booking.count({ where: { status: 'cancelled' } }),
      totalRevenue: await prisma.booking.aggregate({
        where: { status: { in: ['confirmed', 'completed'] } },
        _sum: { totalPrice: true }
      })
    }

    return NextResponse.json({ bookings, stats })
  } catch (error) {
    console.error('Error fetching admin bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { bookingId, status } = body

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    })

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
