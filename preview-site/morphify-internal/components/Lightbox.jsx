'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { cdn } from '@/lib/cdn'

export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (currentIndex === null || !images[currentIndex]) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl leading-none z-10"
        onClick={onClose}
      >
        ×
      </button>

      {/* Prev */}
      <button
        className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 px-2"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
      >
        ‹
      </button>

      {/* Image */}
      <div
        className="relative"
        style={{ maxHeight: '90vh', maxWidth: '80vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={currentIndex}
          src={cdn(images[currentIndex].s3_key)}
          alt=""
          width={900}
          height={1200}
          className="object-contain"
          style={{ maxHeight: '90vh', width: 'auto' }}
          priority
        />
        <div className="absolute bottom-3 right-3 text-white/50 text-xs">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Next */}
      <button
        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 px-2"
        onClick={(e) => { e.stopPropagation(); onNext() }}
      >
        ›
      </button>
    </div>
  )
}
