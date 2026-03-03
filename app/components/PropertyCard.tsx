import Image from 'next/image'
import Link from 'next/link'
import { FaStar } from 'react-icons/fa'

export default function PropertyCard({ item, type = "property" }: { item: any, type?: "property" | "experience" | "service" }) {
  
  // Calculate a fake rating for demo purposes
  const fakeRating = (Math.random() * (5 - 4.5) + 4.5).toFixed(2)

  let linkHref = "/"
  if (type === "property") linkHref = `/properties/${item.id}`
  if (type === "experience") linkHref = `/experiences`
  if (type === "service") linkHref = `/services`

  return (
    <Link href={linkHref} className="group cursor-pointer">
      <div className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3">
          
          {type === "property" && (
            <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
              Guest favorite
            </div>
          )}
          
          {/* Heart Button */}
          <button className="absolute top-3 right-3 z-10 text-white hover:scale-110 transition drop-shadow-md">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'white', strokeWidth: '2', overflow: 'visible' }}><path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path></svg>
          </button>

          {(item.images && item.images[0]) || item.imageUrl ? (
            <Image
              src={type === "property" ? item.images[0].url : item.imageUrl || "/uploads/placeholder.jpg"}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-[15px] text-gray-900 truncate pr-2" title={item.title}>
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-[15px]">
              <FaStar className="text-gray-900 text-xs" />
              <span className="text-gray-900">{fakeRating}</span>
            </div>
          </div>
          
          {type === "property" && (
            <>
              <p className="text-gray-500 text-[15px] mt-0.5 truncate">
                {item.city}, {item.country}
              </p>
              <p className="text-gray-500 text-[15px] mt-0.5">
                2 nights
              </p>
            </>
          )}

          {type === "experience" && (
            <>
              <p className="text-gray-500 text-[15px] mt-0.5 truncate">
                {item.location}
              </p>
              <p className="text-gray-500 text-[15px] mt-0.5">
                Hosted by {item.hostName} · {item.duration}
              </p>
            </>
          )}

          {type === "service" && (
            <>
              <p className="text-gray-500 text-[15px] mt-0.5 truncate">
                {item.provider}
              </p>
              <p className="text-gray-500 text-[15px] mt-0.5 truncate">
                {item.description}
              </p>
            </>
          )}
          
          <div className="mt-1 flex items-center gap-1 text-[15px]">
            <span className="font-semibold text-gray-900">${item.price}</span>
            <span className="text-gray-900">
              {type === "property" ? "night" : type === "experience" ? "person" : "service"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
