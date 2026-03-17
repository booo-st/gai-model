'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Lightbox from '@/components/Lightbox'
import { cdn } from '@/lib/cdn'

export default function ModelDetailPage() {
  const { slug } = useParams()
  const router = useRouter()

  const [model, setModel] = useState(null)
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    fetch(`/api/model/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setModel(data.model)
        setAssets(data.assets || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  const images = assets.filter((a) => a.type === 'image')
  const videoAsset = assets.find((a) => a.type === 'video')
  const cover = assets.find((a) => a.type === 'cover')

  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1))
  const nextImage = () => setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0))

  if (loading) {
    return (
      <div className="bg-[#000000] relative size-full flex items-center justify-center min-h-screen">
        <div className="text-white text-[24px]">Loading model...</div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="bg-[#000000] relative size-full flex items-center justify-center min-h-screen">
        <div className="text-white text-center">
          <div className="text-[24px] mb-4">Model not found</div>
          <button
            onClick={() => router.push('/')}
            className="bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const coverUrl = cover ? cdn(cover.s3_key) : null

  return (
    <div className="bg-[#000000] relative size-full">
      <div className="box-border content-stretch flex flex-col gap-4 items-center justify-start mx-auto p-0 w-[1440px]">

        {/* Hero Section */}
        <div className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full">
          <div className="h-[420px] relative shrink-0 w-full">
            <div
              className="[background-size:auto,_cover] absolute bg-[position:0%_0%,_50%_50%] h-[420px] left-0 top-0 w-full"
              style={{
                backgroundImage: coverUrl
                  ? `linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.6) 100%), url('${coverUrl}')`
                  : 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.6) 100%)',
              }}
            />
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="absolute top-6 left-6 text-white/70 hover:text-white text-sm flex items-center gap-1 z-10 transition-colors"
            >
              ← Back
            </button>
            {/* Model name */}
            <div
              className="absolute font-['Object_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#ffffff] text-[48px] text-center text-nowrap translate-x-[-50%]"
              style={{ top: 'calc(50% - 11px)', left: 'calc(50% + 0.5px)' }}
            >
              <p className="block leading-[normal] whitespace-pre">{model.name}</p>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="relative shrink-0 w-full">
          <div className="flex flex-col items-center justify-center relative size-full">
            <div className="box-border content-stretch flex flex-col gap-20 items-center justify-center px-[88px] py-40 relative w-full">

              {/* First Row — up to 3 images */}
              {images.length >= 1 && (
                <div className="box-border content-stretch flex flex-row gap-8 items-center justify-start p-0 relative shrink-0 w-full">
                  {images.slice(0, 3).map((img, index) => (
                    <div
                      key={img.id}
                      className="basis-0 bg-[#292929] grow h-[500px] min-h-px min-w-px overflow-clip relative shrink-0 cursor-pointer"
                      onClick={() => setLightboxIndex(index)}
                    >
                      <img
                        src={cdn(img.s3_key)}
                        alt={`${model.name} ${index + 1}`}
                        className="absolute bg-top bg-cover bg-no-repeat h-full w-full object-cover object-top"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Video Section */}
              {videoAsset && (
                <div className="flex justify-center w-full">
                  <div className="bg-[#292929] overflow-clip relative shrink-0 w-[600px] h-[600px]">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    >
                      <source src={cdn(videoAsset.s3_key)} type="video/mp4" />
                    </video>
                  </div>
                </div>
              )}

              {/* Last Row — images 4 & 5 */}
              {images.length > 3 && (
                <div className="box-border content-stretch flex flex-row gap-8 items-center justify-start p-0 relative shrink-0 w-full">
                  <div
                    className="basis-0 bg-[#292929] grow h-[500px] min-h-px min-w-px overflow-clip relative shrink-0 cursor-pointer"
                    onClick={() => setLightboxIndex(3)}
                  >
                    <img
                      src={cdn(images[3].s3_key)}
                      alt={`${model.name} 4`}
                      className="absolute bg-top bg-cover bg-no-repeat h-full w-full object-cover object-top"
                    />
                  </div>
                  {images[4] && (
                    <div
                      className="bg-[#292929] h-[500px] overflow-clip relative shrink-0 w-[400px] cursor-pointer"
                      onClick={() => setLightboxIndex(4)}
                    >
                      <img
                        src={cdn(images[4].s3_key)}
                        alt={`${model.name} 5`}
                        className="absolute bg-top bg-cover bg-no-repeat h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  )
}
