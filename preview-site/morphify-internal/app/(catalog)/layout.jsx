import NavBar from '@/components/NavBar'

export default function CatalogLayout({ children }) {
  return (
    <div className="bg-[#000000] text-white min-w-[1440px]">
      <NavBar />
      <main>{children}</main>
    </div>
  )
}
