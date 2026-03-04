'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa'

interface Experience {
  id: string
  title: string
  description: string
  price: number
  location: string
  duration: string
  hostName: string
  imageUrl: string | null
  createdAt: string
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    duration: '',
    hostName: '',
    imageUrl: ''
  })

  useEffect(() => {
    fetchExperiences()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchExperiences = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      
      const res = await fetch(`/api/admin/experiences?${params}`)
      if (res.ok) {
        const data = await res.json()
        setExperiences(data.experiences)
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchExperiences()
  }

  const openAddModal = () => {
    setEditingExperience(null)
    setFormData({ title: '', description: '', price: '', location: '', duration: '', hostName: '', imageUrl: '' })
    setError('')
    setShowModal(true)
  }

  const openEditModal = (exp: Experience) => {
    setEditingExperience(exp)
    setFormData({
      title: exp.title,
      description: exp.description,
      price: exp.price.toString(),
      location: exp.location,
      duration: exp.duration,
      hostName: exp.hostName,
      imageUrl: exp.imageUrl || ''
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const method = editingExperience ? 'PUT' : 'POST'
      const body = editingExperience 
        ? { id: editingExperience.id, ...formData }
        : formData

      const res = await fetch('/api/admin/experiences', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        setShowModal(false)
        fetchExperiences()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save experience')
      }
    } catch (error) {
      setError('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const res = await fetch(`/api/admin/experiences?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchExperiences()
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experiences</h1>
          <p className="text-gray-500">Manage tours, activities, and adventures</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition"
        >
          <FaPlus /> Add Experience
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search experiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
          />
        </div>
      </form>

      {/* Experiences Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FaStar className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No experiences yet</h3>
          <p className="text-gray-500 mt-1">Add your first experience to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div className="h-40 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {exp.imageUrl ? (
                  <img src={exp.imageUrl} alt={exp.title} className="w-full h-full object-cover" />
                ) : (
                  <FaStar className="text-white text-4xl" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{exp.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{exp.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-[#FF385C]" /> {exp.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-[#FF385C]" /> {exp.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">${exp.price}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="p-2 text-gray-500 hover:text-[#FF385C] hover:bg-gray-100 rounded-lg transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {editingExperience ? 'Edit Experience' : 'Add Experience'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 3 hours"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Host Name</label>
                <input
                  type="text"
                  required
                  value={formData.hostName}
                  onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
