'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: 'All', href: '/' },
  { label: 'International', href: '/international' },
  { label: 'Asian', href: '/asian' },
  { label: 'Preview', href: '/preview' },
]

export default function NavBar() {
  const pathname = usePathname()

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="bg-[#000000] w-full">
      <div className="box-border content-stretch flex flex-row items-center justify-between pb-[30px] pt-[60px] px-[60px] relative shrink-0 w-[1440px] mx-auto">
        {/* Logo */}
        <div className="h-[30px] opacity-80 cursor-pointer hover:opacity-100 transition-opacity duration-200">
          <Link href="/">
            <span className="text-white text-[20px] font-medium">⊙ morphify</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="box-border content-stretch flex flex-row gap-[43px] items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[18px] text-center">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative shrink-0 cursor-pointer transition-colors duration-200 ${
                isActive(tab.href)
                  ? 'text-[#ffffff]'
                  : 'text-[#666666] hover:text-[#999999]'
              }`}
            >
              <p className="block leading-[normal]">{tab.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
