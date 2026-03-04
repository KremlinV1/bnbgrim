import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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
    
    return NextResponse.json({ properties })
  } catch (error: any) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
