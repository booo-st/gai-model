'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cdn } from '@/lib/cdn'

const PAGE_SIZE = 6

export default function ModelCarousel({ models, selectedId, onSelect }) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(models.length / PAGE_SIZE)
  const pageModels = models.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const prevPage = () => setPage((p) => Math.max(0, p - 1))
  const nextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1))

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        {/* Prev arrow */}
        <button
          className="text-white/60 hover:text-white text-2xl w-8 h-8 flex items-center justify-center disabled:opacity-20"
          onClick={prevPage}
          disabled={page === 0}
        >
          ‹
        </button>

        {/* Thumbnails */}
        <div className="flex items-center gap-4">
          {pageModels.map((model) => {
            const isSelected = model.model_id === selectedId
            return (
              <div
                key={model.model_id}
                className="flex flex-col items-center gap-1 cursor-pointer"
                onClick={() => onSelect(model)}
              >
                <div
                  className="rounded-full overflow-hidden flex-shrink-0"
                  style={{
                    width: 72,
                    height: 72,
                    opacity: isSelected ? 1 : 0.6,
                    outline: isSelected ? '2px solid white' : 'none',
                    outlineOffset: 2,
                  }}
                >
                  {model.thumbnail_key ? (
                    <Image
                      src={cdn(model.thumbnail_key)}
                      alt={model.name}
                      width={72}
                      height={72}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-700" />
                  )}
                </div>
                {isSelected && (
                  <span className="text-white text-xs text-center max-w-[80px] truncate">
                    {model.name}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Next arrow */}
        <button
          className="text-white/60 hover:text-white text-2xl w-8 h-8 flex items-center justify-center disabled:opacity-20"
          onClick={nextPage}
          disabled={page >= totalPages - 1}
        >
          ›
        </button>
      </div>

      {/* Dot indicators */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="rounded-full transition-all"
              style={{
                width: i === page ? 8 : 6,
                height: i === page ? 8 : 6,
                backgroundColor: i === page ? '#fff' : '#555',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
