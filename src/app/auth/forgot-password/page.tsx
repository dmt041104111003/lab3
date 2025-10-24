'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/session'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const session = getSession()
    if (session) {
      router.push('/')
      return
    }
    setUser(session)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Vui lòng nhập email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Đã gửi link đặt lại mật khẩu đến email của bạn!')
        setEmail('')
      } else {
        setError(data.error || 'Có lỗi xảy ra khi gửi email')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi gửi email')
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tech-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <img
              src="/footer.png"
              alt="TechNova Logo"
              className="mx-auto h-12 w-auto"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập email của bạn để nhận link đặt lại mật khẩu
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-tech-blue focus:border-tech-blue sm:text-sm"
                  placeholder="Nhập email của bạn"
                />
              </div>
            </div>

                     <div className="flex flex-col space-y-3">
                       <div className="flex space-x-4">
                         <Link
                           href="/auth/signin"
                           className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tech-blue"
                         >
                           Quay lại
                         </Link>
                         <button
                           type="submit"
                           disabled={isLoading}
                           className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tech-blue hover:bg-tech-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tech-blue disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại'}
                         </button>
                       </div>
                       
                       <div className="text-center">
                         <Link
                           href="/"
                           className="text-sm text-tech-blue hover:text-tech-dark-blue"
                         >
                           ← Về trang chủ
                         </Link>
                       </div>
                     </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã nhớ mật khẩu?{' '}
              <Link
                href="/auth/signin"
                className="font-medium text-tech-blue hover:text-tech-dark-blue"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
