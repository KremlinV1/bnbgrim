import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { location: { contains: search, mode: 'insensitive' as const } },
        { hostName: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {}

    const experiences = await prisma.experience.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ experiences })
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, location, duration, hostName, imageUrl } = body

    if (!title || !description || !price || !location || !duration || !hostName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const experience = await prisma.experience.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        duration,
        hostName,
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json({ experience }, { status: 201 })
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, price, location, duration, hostName, imageUrl } = body

    if (!id) {
      return NextResponse.json({ error: 'Experience ID required' }, { status: 400 })
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        duration,
        hostName,
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json({ experience })
  } catch (error) {
    console.error('Error updating experience:', error)
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Experience ID required' }, { status: 400 })
    }

    await prisma.experience.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}
