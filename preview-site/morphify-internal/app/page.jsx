'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'

const CDN = process.env.NEXT_PUBLIC_CDN_BASE_URL

export default function IntroScreen() {
  const router = useRouter()

  return (
    <div className="bg-black relative w-full min-h-screen overflow-hidden" data-name="main/splash-screen">
      {/* 배경 영상 */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={`${CDN}/intro_video.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-80" />
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="absolute content-stretch flex flex-col gap-[80px] items-center left-[calc(50%+0.5px)] top-[calc(50%-0.38px)] translate-x-[-50%] translate-y-[-50%] w-[993px]">

        {/* 로고 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Image
            src={`${CDN}/Morphify_logo_white.png`}
            alt="morphify"
            height={40}
            width={160}
            className="h-[40px] w-auto object-contain"
          />
        </motion.div>

        {/* 텍스트 */}
        <motion.div
          className="content-stretch flex flex-col gap-[48px] items-center leading-[1.25] not-italic relative shrink-0 text-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="relative shrink-0 text-[48px] text-white w-full">
            <p className="mb-0">Morphify transforms ideas into human-like</p>
            <p>identities for any digital experience.</p>
          </div>
          <p className="relative shrink-0 text-[24px] text-[rgba(255,255,255,0.5)] w-full">
            Consistent. Realistic. Customizable. Your AI Personas, ready for production.
          </p>
        </motion.div>

        {/* Explore Personas 버튼 — Liquid Glass */}
        <motion.button
          onClick={() => router.push('/home')}
          className="relative content-stretch flex items-center overflow-hidden px-[28px] py-[10px] rounded-[100px] shrink-0 cursor-pointer border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, scale: { duration: 0.2 } }}
          whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37), inset 0 1px 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[100px]">
            <div
              className="absolute backdrop-blur-[20px] backdrop-saturate-[180%] inset-0 rounded-[100px]"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))' }}
            />
          </div>
          <p className="relative shrink-0 text-[17px] text-nowrap text-white tracking-[-0.1px] font-medium my-[12px]" style={{ lineHeight: 1 }}>
            Explore Personas
          </p>
          <div
            className="absolute inset-0 pointer-events-none rounded-[100px]"
            style={{ boxShadow: 'inset 0 1px 2px 0 rgba(255,255,255,0.4), inset 0 -1px 2px 0 rgba(0,0,0,0.2)' }}
          />
        </motion.button>

      </div>
    </div>
  )
}
