'use client'

import { cdn } from '@/lib/cdn'

export default function PreviewPlayer({ beforeKey, afterKey }) {
  return (
    <div className="flex items-start justify-center gap-8 w-full">
      {/* Before */}
      <div className="flex flex-col items-center gap-2" style={{ width: '45%' }}>
        <span className="text-white text-sm">Before</span>
        <div className="w-full" style={{ aspectRatio: '16/9', backgroundColor: '#111' }}>
          {beforeKey ? (
            <video
              key={beforeKey}
              src={cdn(beforeKey)}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 animate-pulse" />
          )}
        </div>
      </div>

      {/* After */}
      <div className="flex flex-col items-center gap-2" style={{ width: '45%' }}>
        <span className="text-white text-sm">After</span>
        <div className="w-full" style={{ aspectRatio: '16/9', backgroundColor: '#111' }}>
          {afterKey ? (
            <video
              key={afterKey}
              src={cdn(afterKey)}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  )
}
