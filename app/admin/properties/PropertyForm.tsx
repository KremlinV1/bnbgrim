"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type Amenity = { id: string; name: string }

export default function PropertyForm({
  initialData,
  amenitiesList
}: {
  initialData?: any
  amenitiesList: Amenity[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [files, setFiles] = useState<File[]>([])
  
  // Selected amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities?.map((a: any) => a.id) || []
  )
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      
      // Add selected amenities
      formData.append("amenities", JSON.stringify(selectedAmenities))
      
      // Add images
      files.forEach((file) => {
        formData.append("images", file)
      })

      const url = initialData 
        ? `/api/admin/properties/${initialData.id}` 
        : `/api/admin/properties`
        
      const method = initialData ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Something went wrong")
      }

      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to save property")
    } finally {
      setLoading(false)
    }
  }

  const handleAmenityToggle = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) 
        ? prev.filter(aId => aId !== id)
        : [...prev, id]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              name="title" 
              defaultValue={initialData?.title} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description} 
              required 
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per night ($)</label>
              <input 
                name="price" 
                type="text"
                inputMode="decimal"
                defaultValue={initialData?.price} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host Name</label>
              <input 
                name="hostName" 
                defaultValue={initialData?.hostName} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input 
              name="address" 
              defaultValue={initialData?.address} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input 
                name="city" 
                defaultValue={initialData?.city} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input 
                name="country" 
                defaultValue={initialData?.country} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input 
                name="bedrooms" 
                type="text"
                inputMode="numeric"
                defaultValue={initialData?.bedrooms} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input 
                name="bathrooms" 
                type="text"
                inputMode="numeric"
                defaultValue={initialData?.bathrooms} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
              <input 
                name="maxGuests" 
                type="text"
                inputMode="numeric"
                defaultValue={initialData?.maxGuests} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {amenitiesList.map(amenity => (
            <label key={amenity.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity.id)}
                onChange={() => handleAmenityToggle(amenity.id)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{amenity.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
        
        {initialData?.images && initialData.images.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Current Images:</p>
            <div className="flex gap-2 flex-wrap">
              {initialData.images.map((img: any) => (
                <div key={img.id} className="relative w-24 h-24 border rounded overflow-hidden">
                  <Image src={img.url} alt="Property" fill className="object-cover" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Uploading new images will replace existing ones.</p>
          </div>
        )}

        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="border-t border-gray-200 pt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Property"}
        </button>
      </div>
    </form>
  )
}
