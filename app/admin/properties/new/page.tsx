import { prisma } from "@/lib/prisma"
import PropertyForm from "../PropertyForm"

export default async function NewPropertyPage() {
  const amenities = await prisma.amenity.findMany()
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Property</h1>
      <PropertyForm amenitiesList={amenities} />
    </div>
  )
}
