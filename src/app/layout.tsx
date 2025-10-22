import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
         <link rel="icon" href="/logo.png" />
 
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.GOOGLE_ID!}>
          {children}
          </GoogleOAuthProvider>
      </body>
    </html>
  )
}
