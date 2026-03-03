import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/upload'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    
    // Extract basic fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const country = formData.get('country') as string
    const bedrooms = parseInt(formData.get('bedrooms') as string, 10)
    const bathrooms = parseInt(formData.get('bathrooms') as string, 10)
    const maxGuests = parseInt(formData.get('maxGuests') as string, 10)
    const hostName = formData.get('hostName') as string
    
    // Parse amenities
    const amenitiesJson = formData.get('amenities') as string
    let amenities: string[] = []
    if (amenitiesJson) {
      amenities = JSON.parse(amenitiesJson)
    }

    // Process images
    const images = formData.getAll('images') as File[]
    const uploadedImages: { url: string; isMain: boolean }[] = []
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      if (file && file.size > 0) {
        const url = await uploadFile(file)
        if (url) {
          uploadedImages.push({
            url,
            isMain: i === 0 // First image is main
          })
        }
      }
    }

    // Create property in DB
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price,
        address,
        city,
        country,
        bedrooms,
        bathrooms,
        maxGuests,
        hostName,
        amenities: {
          connect: amenities.map(id => ({ id }))
        },
        images: {
          create: uploadedImages
        }
      }
    })

    return NextResponse.json({ success: true, property })
  } catch (error: any) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create property' },
      { status: 500 }
    )
  }
}
