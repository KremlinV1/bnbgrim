"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaTrash } from "react-icons/fa"

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete property")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition disabled:opacity-50"
      title="Delete property"
    >
      <FaTrash className={`${isDeleting ? 'text-gray-400' : 'text-red-500'}`} />
    </button>
  )
}
