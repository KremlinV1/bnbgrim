import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  })

  console.log({ admin })

  // Create standard amenities
  const amenities = [
    'WiFi',
    'Kitchen',
    'Air conditioning',
    'Heating',
    'Washing machine',
    'TV',
    'Pool',
    'Free parking',
    'Gym',
    'Beach access',
    'Hot tub',
    'Pet friendly'
  ]

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity },
      update: {},
      create: {
        name: amenity,
      },
    })
  }
  
  // Seed sample experiences
  await prisma.experience.deleteMany({}) // clear existing
  await prisma.experience.createMany({
    data: [
      {
        title: 'Blue Hole Private Tour',
        description: 'Explore the hidden gems of Jamaica with a guided tour of the famous Blue Hole.',
        price: 85.00,
        location: 'Ocho Rios, Jamaica',
        duration: '4 hours',
        hostName: 'Marcus',
      },
      {
        title: 'Authentic Jamaican Cooking Class',
        description: 'Learn to cook traditional jerk chicken and festival in a local home.',
        price: 60.00,
        location: 'Montego Bay, Jamaica',
        duration: '3 hours',
        hostName: 'Sarah',
      },
      {
        title: 'Sunset Catamaran Cruise',
        description: 'Sail along the coast as the sun sets, with open bar and music.',
        price: 120.00,
        location: 'Negril, Jamaica',
        duration: '2.5 hours',
        hostName: 'Captain Dave',
      }
    ]
  })
  
  // Seed sample services
  await prisma.service.deleteMany({}) // clear existing
  await prisma.service.createMany({
    data: [
      {
        title: 'Private Chef',
        description: 'Enjoy restaurant-quality meals prepared in your rental by a professional chef.',
        price: 150.00,
        provider: 'Culinary Delights Ja',
      },
      {
        title: 'Airport Transfer (VIP)',
        description: 'Luxury SUV pickup from the airport directly to your accommodation.',
        price: 100.00,
        provider: 'Island Routes',
      },
      {
        title: 'In-house Massage Therapy',
        description: 'Relax with a 60-minute Swedish or Deep Tissue massage without leaving your room.',
        price: 90.00,
        provider: 'Zen Spa Services',
      }
    ]
  })

  console.log('Amenities, Experiences, and Services seeded')

  // Seed 10 sample properties
  const existingProperties = await prisma.property.count()
  if (existingProperties === 0) {
    const allAmenities = await prisma.amenity.findMany()
    
    const properties = [
      {
        title: 'Oceanfront Villa with Private Pool',
        description: 'Stunning 4-bedroom villa with panoramic ocean views, infinity pool, and direct beach access. Perfect for families or groups seeking luxury and privacy.',
        price: 450,
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        address: '123 Beachfront Drive',
        city: 'Ocho Rios',
        country: 'Jamaica',
        hostName: 'Michael',
      },
      {
        title: 'Cozy Mountain Retreat',
        description: 'Escape to the Blue Mountains in this charming 2-bedroom cottage surrounded by coffee plantations and lush greenery.',
        price: 175,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        address: '45 Mountain View Road',
        city: 'Blue Mountains',
        country: 'Jamaica',
        hostName: 'Sandra',
      },
      {
        title: 'Modern Downtown Apartment',
        description: 'Sleek 1-bedroom apartment in the heart of Kingston with rooftop pool access and stunning city views.',
        price: 120,
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        address: '78 New Kingston Blvd',
        city: 'Kingston',
        country: 'Jamaica',
        hostName: 'Devon',
      },
      {
        title: 'Beachside Bungalow',
        description: 'Charming bungalow steps from Seven Mile Beach. Wake up to the sound of waves and enjoy spectacular sunsets.',
        price: 280,
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        address: '12 Sunset Lane',
        city: 'Negril',
        country: 'Jamaica',
        hostName: 'Keisha',
      },
      {
        title: 'Luxury Penthouse Suite',
        description: 'Exclusive 3-bedroom penthouse with wraparound terrace, private jacuzzi, and 360-degree views of Montego Bay.',
        price: 550,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        address: '1 Hip Strip Plaza',
        city: 'Montego Bay',
        country: 'Jamaica',
        hostName: 'Richard',
      },
      {
        title: 'Tropical Garden Cottage',
        description: 'Peaceful 1-bedroom cottage nestled in a botanical garden setting with outdoor shower and hammock terrace.',
        price: 95,
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        address: '34 Garden Path',
        city: 'Port Antonio',
        country: 'Jamaica',
        hostName: 'Marcia',
      },
      {
        title: 'Cliffside Eco-Lodge',
        description: 'Sustainable 2-bedroom lodge perched on cliffs overlooking the Caribbean. Solar-powered with organic garden.',
        price: 220,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        address: '89 Cliff Edge Road',
        city: 'Treasure Beach',
        country: 'Jamaica',
        hostName: 'Trevor',
      },
      {
        title: 'Historic Great House',
        description: 'Restored 5-bedroom colonial great house with original architecture, pool, and 10 acres of tropical gardens.',
        price: 750,
        bedrooms: 5,
        bathrooms: 4,
        maxGuests: 10,
        address: '1 Heritage Estate',
        city: 'Falmouth',
        country: 'Jamaica',
        hostName: 'Patricia',
      },
      {
        title: 'Riverside Cabin',
        description: 'Rustic-chic 2-bedroom cabin on the banks of the Rio Grande. Includes private dock and kayaks.',
        price: 165,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        address: '56 River Road',
        city: 'Port Antonio',
        country: 'Jamaica',
        hostName: 'Andrew',
      },
      {
        title: 'Seaside Studio Loft',
        description: 'Bright and airy studio loft with floor-to-ceiling windows, kitchenette, and balcony overlooking the marina.',
        price: 110,
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        address: '23 Marina Way',
        city: 'Ocho Rios',
        country: 'Jamaica',
        hostName: 'Nicole',
      },
    ]

    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i]
      // Assign random amenities (3-6 per property)
      const shuffled = allAmenities.sort(() => 0.5 - Math.random())
      const selectedAmenities = shuffled.slice(0, Math.floor(Math.random() * 4) + 3)

      await prisma.property.create({
        data: {
          ...prop,
          amenities: {
            connect: selectedAmenities.map(a => ({ id: a.id }))
          }
        }
      })
    }
    console.log('10 sample properties created')
  } else {
    console.log('Properties already exist, skipping property seed')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
