import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TechNova - Công nghệ & Đời sống',
  description: 'Trang tin công nghệ hàng đầu Việt Nam, cập nhật xu hướng công nghệ mới và tác động của chúng tới đời sống con người.',
  keywords: 'công nghệ, AI, chuyển đổi số, startup, đổi mới sáng tạo, TechNova',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
