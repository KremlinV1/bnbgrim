import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadFile, deleteFile } from '@/lib/upload'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const propertyId = params.id
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

    // First update the basic property details
    await prisma.property.update({
      where: { id: propertyId },
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
          set: [], // Clear existing
          connect: amenities.map(id => ({ id })) // Connect new ones
        }
      }
    })

    // Process new images if any were uploaded
    const images = formData.getAll('images') as File[]
    const hasNewImages = images.some(file => file.size > 0)
    
    if (hasNewImages) {
      // Get existing images to delete them
      const existingImages = await prisma.image.findMany({
        where: { propertyId }
      })
      
      // Delete old image files from filesystem
      for (const img of existingImages) {
        await deleteFile(img.url)
      }
      
      // Delete old image records from database
      await prisma.image.deleteMany({
        where: { propertyId }
      })
      
      // Upload and save new images
      const uploadedImages = []
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        if (file && file.size > 0) {
          const url = await uploadFile(file)
          if (url) {
            uploadedImages.push({
              url,
              isMain: i === 0,
              propertyId
            })
          }
        }
      }
      
      if (uploadedImages.length > 0) {
        await prisma.image.createMany({
          data: uploadedImages
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update property' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const propertyId = params.id

    // Get existing images
    const existingImages = await prisma.image.findMany({
      where: { propertyId }
    })
    
    // Delete image files from filesystem
    for (const img of existingImages) {
      await deleteFile(img.url)
    }
    
    // Delete property from database
    // This will cascade and delete image records too
    await prisma.property.delete({
      where: { id: propertyId }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete property' },
      { status: 500 }
    )
  }
}
