import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import DeleteButton from "./DeleteButton"
import { FaHome, FaUsers, FaStar, FaDollarSign, FaPlus, FaEdit, FaTrash } from "react-icons/fa"

async function getProperties() {
  return await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        where: { isMain: true },
        take: 1
      }
    }
  })
}

async function getStats() {
  const totalProperties = await prisma.property.count()
  const totalExperiences = await prisma.experience.count()
  const totalServices = await prisma.service.count()
  return { totalProperties, totalExperiences, totalServices }
}

export default async function AdminDashboard() {
  const properties = await getProperties()
  const stats = await getStats()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your listings.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaHome className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FaStar className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Experiences</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalExperiences}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaDollarSign className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Services</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Properties</h2>
            <p className="text-sm text-gray-500">Manage your property listings</p>
          </div>
          <Link 
            href="/admin/properties/new" 
            className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-4 py-2.5 rounded-xl font-medium transition"
          >
            <FaPlus className="text-sm" />
            Add Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHome className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
            <p className="text-gray-500 mt-1">Get started by adding your first property.</p>
            <Link 
              href="/admin/properties/new" 
              className="inline-flex items-center gap-2 mt-4 text-[#FF385C] font-medium hover:underline"
            >
              <FaPlus className="text-sm" />
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {properties.map((property: any) => (
              <div key={property.id} className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition">
                {/* Image */}
                <div className="aspect-[4/3] relative bg-gray-200">
                  {property.images && property.images[0] ? (
                    <Image
                      src={property.images[0].url}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <FaHome className="text-gray-300 text-4xl mx-auto mb-2" />
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    </div>
                  )}
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <Link 
                      href={`/admin/properties/${property.id}/edit`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      <FaEdit className="text-gray-700" />
                    </Link>
                    <DeleteButton id={property.id} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                  <p className="text-sm text-gray-500">{property.city}, {property.country}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gray-900">${property.price}</span>
                    <span className="text-sm text-gray-500">per night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
