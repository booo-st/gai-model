'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cdn } from '@/lib/cdn'

export default function ModelCard({ model, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  return (
    <div
      className="h-[420px] overflow-clip relative shrink-0 w-[360px] cursor-pointer animate-fadeInUp"
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'backwards',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/model/${model.slug}`)}
    >
      {/* Image */}
      {model.cover_key ? (
        <img
          src={cdn(model.cover_key)}
          alt={model.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 300ms ease-in-out',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#292929]" />
      )}

      {/* Hover overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10">
          <div className="text-white text-[24px] text-center mb-4">
            {model.name}
          </div>
          <button className="bg-white text-black px-6 py-2 text-[14px] font-medium hover:bg-gray-200 transition-colors duration-200 rounded-sm">
            View
          </button>
        </div>
      )}
    </div>
  )
}
