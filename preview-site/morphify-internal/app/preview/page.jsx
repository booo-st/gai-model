'use client'

import { useState, useEffect, useRef } from 'react'
import { cdn } from '@/lib/cdn'

// Arrow Icon
function ArrowIcon({ direction = 'right', disabled = false }) {
  return (
    <div
      className={`relative size-6 ${direction === 'left' ? 'rotate-180' : ''} ${disabled ? 'opacity-30' : 'opacity-100'}`}
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path
          d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
          fill={disabled ? '#333333' : '#5F6368'}
        />
      </svg>
    </div>
  )
}

export default function PreviewPage() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [transformations, setTransformations] = useState([])
  const [selectedTransformation, setSelectedTransformation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [videoLoading, setVideoLoading] = useState({ before: false, after: false })
  const [videoErrors, setVideoErrors] = useState({ before: false, after: false })
  const beforeVideoRef = useRef(null)
  const MODELS_PER_PAGE = 6

  // Load categories on mount
  useEffect(() => {
    fetch('/api/preview/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data)
        if (data.length > 0) setSelectedCategory(data[0])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Load transformations when category changes
  useEffect(() => {
    if (!selectedCategory) return
    fetch(`/api/preview/transformations?category_id=${selectedCategory.id}`)
      .then((r) => r.json())
      .then((data) => {
        setTransformations(data)
        setSelectedTransformation(data.length > 0 ? data[0] : null)
        setCurrentPage(0)
        setVideoErrors({ before: false, after: false })
      })
  }, [selectedCategory])

  const beforeKey = selectedTransformation?.before_video_s3_key ?? null
  const afterKey = selectedTransformation?.after_video_s3_key ?? null

  const totalPages = Math.ceil(transformations.length / MODELS_PER_PAGE)
  const displayedTransformations = transformations.slice(
    currentPage * MODELS_PER_PAGE,
    (currentPage + 1) * MODELS_PER_PAGE
  )

  const canGoLeft = currentPage > 0
  const canGoRight = currentPage < totalPages - 1

  const handleVideoLoadStart = (type) =>
    setVideoLoading((prev) => ({ ...prev, [type]: true }))
  const handleVideoLoad = (type) => {
    setVideoLoading((prev) => ({ ...prev, [type]: false }))
    if (type === 'after' && beforeVideoRef.current) {
      beforeVideoRef.current.currentTime = 0
      beforeVideoRef.current.play().catch(() => {})
    }
  }
  const handleVideoError = (type) => {
    setVideoLoading((prev) => ({ ...prev, [type]: false }))
    setVideoErrors((prev) => ({ ...prev, [type]: true }))
  }

  if (loading) {
    return (
      <div className="bg-[#000000] relative size-full">
        <div className="flex justify-center items-center h-96">
          <div className="text-white text-[24px]">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#000000] relative size-full">
      {/* Video Transformation Preview Title Bar — Full Width */}
      <div className="bg-[#4a4a4a] relative shrink-0 w-full">
        <div className="flex flex-row items-center justify-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-2 py-4 relative w-full">
            <div className="font-['Pretendard:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[24px] text-center text-nowrap">
              <p className="block leading-[normal] whitespace-pre font-normal">
                Video Transformation Preview
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="box-border content-stretch flex flex-col gap-8 items-center justify-start mx-auto p-0 w-[1440px]">

        {/* Category Tabs */}
        <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 pt-8 relative shrink-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-1.5 relative rounded-[16px] shrink-0 transition-all duration-200 hover:scale-105 hover:bg-[rgba(255,255,255,0.2)] ${
                selectedCategory?.id === category.id ? 'bg-[rgba(255,255,255,0.3)]' : ''
              }`}
            >
              <div
                aria-hidden="true"
                className={`absolute border-2 ${
                  selectedCategory?.id === category.id
                    ? 'border-[#ffffff]'
                    : 'border-[rgba(255,255,255,0.5)]'
                } border-solid inset-0 pointer-events-none rounded-[16px]`}
              />
              <div
                className={`${
                  selectedCategory?.id === category.id
                    ? "font-['Pretendard:Medium',_sans-serif]"
                    : "font-['Pretendard:Light',_sans-serif]"
                } leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[20px] text-center text-nowrap`}
              >
                <p className="block leading-[normal] whitespace-pre">{category.display_name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Video Section */}
        <div className="box-border content-stretch flex flex-row gap-4 items-center justify-center px-0 py-4 relative shrink-0 w-full">

          {/* Before Video */}
          <div className="box-border content-stretch flex flex-col gap-4 items-center justify-start p-0 relative shrink-0">
            <div className="font-['Pretendard:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] opacity-50 text-[24px] text-center text-nowrap">
              <p className="block leading-[normal] whitespace-pre">Before</p>
            </div>
            <div className="bg-[#292929] h-[400px] relative shrink-0 w-[632px]">
              <div className="h-[400px] overflow-clip relative w-[632px]">
                {beforeKey ? (
                  <>
                    {videoLoading.before && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-white text-sm">Loading video...</div>
                      </div>
                    )}
                    {videoErrors.before ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-red-400 text-center text-sm">Failed to load video</div>
                      </div>
                    ) : (
                      <video
                        ref={beforeVideoRef}
                        key={`before-${selectedTransformation?.id}`}
                        width="632"
                        height="400"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-contain"
                        onLoadStart={() => handleVideoLoadStart('before')}
                        onCanPlay={() => handleVideoLoad('before')}
                        onError={() => handleVideoError('before')}
                      >
                        <source src={cdn(beforeKey)} type="video/mp4" />
                      </video>
                    )}
                  </>
                ) : (
                  <div
                    className="absolute font-['Object_Sans:Regular',_sans-serif] leading-[0] left-1/2 not-italic opacity-50 text-[#ffffff] text-[24px] text-center text-nowrap translate-x-[-50%]"
                    style={{ top: 'calc(50% - 8px)' }}
                  >
                    <p className="block leading-[normal] whitespace-pre">Select a category</p>
                  </div>
                )}
              </div>
              <div
                aria-hidden="true"
                className="absolute border border-[#313131] border-solid inset-0 pointer-events-none"
              />
            </div>
          </div>

          {/* After Video */}
          <div className="box-border content-stretch flex flex-col gap-4 items-center justify-start p-0 relative shrink-0">
            <div className="font-['Pretendard:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] opacity-50 text-[24px] text-center text-nowrap">
              <p className="block leading-[normal] whitespace-pre">After</p>
            </div>
            <div className="bg-[#292929] h-[400px] overflow-clip relative shrink-0 w-[632px]">
              {afterKey ? (
                <>
                  {videoLoading.after && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="text-white text-sm">Loading video...</div>
                    </div>
                  )}
                  {videoErrors.after ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-red-400 text-center text-sm">Failed to load video</div>
                    </div>
                  ) : (
                    <video
                      key={`after-${selectedTransformation?.id}-${afterKey}`}
                      width="632"
                      height="400"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-contain"
                      onLoadStart={() => handleVideoLoadStart('after')}
                      onCanPlay={() => handleVideoLoad('after')}
                      onError={() => handleVideoError('after')}
                    >
                      <source src={cdn(afterKey)} type="video/mp4" />
                    </video>
                  )}
                </>
              ) : (
                <div
                  className="absolute font-['Object_Sans:Regular',_sans-serif] leading-[0] left-1/2 not-italic opacity-50 text-[#ffffff] text-[24px] text-center text-nowrap translate-x-[-50%]"
                  style={{ top: 'calc(50% - 8px)' }}
                >
                  <p className="block leading-[normal] whitespace-pre">Select a model</p>
                </div>
              )}
              <div
                aria-hidden="true"
                className="absolute border border-[#313131] border-solid inset-0 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Model Carousel */}
        <div className="box-border content-stretch flex flex-row gap-4 items-center justify-center p-0 relative shrink-0">
          {/* Left Arrow */}
          <div
            className={`flex items-center justify-center relative shrink-0 transition-all duration-200 ${
              canGoLeft ? 'cursor-pointer hover:opacity-75 hover:scale-105' : 'cursor-not-allowed'
            }`}
            onClick={() => canGoLeft && setCurrentPage((p) => p - 1)}
          >
            <ArrowIcon direction="left" disabled={!canGoLeft} />
          </div>

          {/* Thumbnails — 6 per page */}
          {displayedTransformations.map((t) => {
            const isSelected = selectedTransformation?.id === t.id
            return (
              <div
                key={t.id}
                className="overflow-clip relative rounded-[85px] shrink-0 size-[140px] cursor-pointer transition-all duration-300 hover:scale-105 group"
                onClick={() => {
                  setSelectedTransformation(t)
                  setVideoErrors({ before: false, after: false })
                }}
              >
                {/* Thumbnail image */}
                <div
                  className="absolute bg-center bg-cover bg-no-repeat inset-0"
                  style={{
                    backgroundImage: t.thumbnail_key
                      ? `url('${cdn(t.thumbnail_key)}')`
                      : undefined,
                    backgroundColor: t.thumbnail_key ? undefined : '#292929',
                  }}
                />

                {/* Selected overlay */}
                {isSelected && (
                  <>
                    <div className="absolute bg-[#00000099] inset-0" />
                    <div
                      className="absolute font-['Object_Sans:Regular',_sans-serif] leading-[0] left-1/2 not-italic text-[#ffffff] text-[18px] text-center text-nowrap translate-x-[-50%]"
                      style={{ top: 'calc(50% - 5px)' }}
                    >
                      <p className="block leading-[normal] whitespace-pre">{t.name}</p>
                    </div>
                  </>
                )}

                {/* Hover overlay (only when not selected) */}
                {!isSelected && (
                  <>
                    <div className="absolute bg-[#00000099] inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div
                      className="absolute font-['Object_Sans:Regular',_sans-serif] leading-[0] left-1/2 not-italic text-[#ffffff] text-[18px] text-center text-nowrap translate-x-[-50%] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ top: 'calc(50% - 5px)' }}
                    >
                      <p className="block leading-[normal] whitespace-pre">{t.name}</p>
                    </div>
                  </>
                )}
              </div>
            )
          })}

          {/* Right Arrow */}
          <div
            className={`flex items-center justify-center relative shrink-0 transition-all duration-200 ${
              canGoRight ? 'cursor-pointer hover:opacity-75 hover:scale-105' : 'cursor-not-allowed'
            }`}
            onClick={() => canGoRight && setCurrentPage((p) => p + 1)}
          >
            <ArrowIcon direction="right" disabled={!canGoRight} />
          </div>
        </div>

        {/* Page indicator dots */}
        {totalPages > 1 && (
          <div className="flex gap-2 items-center justify-center pb-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                  i === currentPage ? 'bg-white' : 'bg-gray-600'
                }`}
                onClick={() => setCurrentPage(i)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
