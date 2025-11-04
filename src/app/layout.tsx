import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SessionSync from '@/components/SessionSync'

const inter = Inter({ subsets: ['latin'] })
const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather'
})

export const metadata = {
  title: 'TechNova - Nền tảng tin tức công nghệ hàng đầu Việt Nam',
  description: 'Cập nhật tin tức công nghệ mới nhất, đánh giá sản phẩm, xu hướng công nghệ và chuyển đổi số tại Việt Nam.',
  keywords: 'công nghệ, tin tức công nghệ, AI, chuyển đổi số, startup, đổi mới sáng tạo, blockchain, metaverse',
  robots: 'index, follow',
  openGraph: {
    title: 'TechNova - Nền tảng tin tức công nghệ hàng đầu Việt Nam',
    description: 'Cập nhật tin tức công nghệ mới nhất, đánh giá sản phẩm, xu hướng công nghệ và chuyển đổi số tại Việt Nam.',
    url: 'https://technova.id.vn',
    siteName: 'TechNova',
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/footer.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="canonical" href="https://technova.id.vn" />
      </head>
      <body className={`${inter.className} ${merriweather.variable}`}>
        <GoogleOAuthProvider clientId={process.env.GOOGLE_ID!}>
          <SessionSync />
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
