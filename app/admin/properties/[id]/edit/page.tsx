import { prisma } from "@/lib/prisma"
import PropertyForm from "../../PropertyForm"
import { notFound } from "next/navigation"

export default async function EditPropertyPage({
  params
}: {
  params: { id: string }
}) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      amenities: true
    }
  })

  if (!property) {
    notFound()
  }

  const amenities = await prisma.amenity.findMany()
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Property</h1>
      <PropertyForm initialData={property} amenitiesList={amenities} />
    </div>
  )
}
