import './globals.css'

export const metadata = {
  title: 'Morphify — Model Catalog',
  description: 'Internal AI model catalog',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#000000] text-white min-w-[1440px]">
        {children}
      </body>
    </html>
  )
}
