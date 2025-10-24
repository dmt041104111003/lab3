'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { GoogleLogin } from "@react-oauth/google"

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const user = getSession()
    if (user) {
      if (user.role === 'ADMIN') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/'
      }
    }
  }, [])

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email là bắt buộc')
      return false
    }
    if (!formData.password.trim()) {
      setError('Mật khẩu là bắt buộc')
      return false
    }
    if (formData.email.toLowerCase() === 'admin') {
      return true
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('user_session', JSON.stringify(data.user))
        try {
          await fetch('/api/set-cookie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: data.user }),
          })
        } catch (error) {}

        if (data.user.role === 'ADMIN') window.location.href = '/admin'
        else window.location.href = '/'
      } else {
        setError(data.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'google', token }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('user_session', JSON.stringify(data.user))
        if (data.user.role === 'ADMIN') window.location.href = '/admin'
        else window.location.href = '/'
      } else {
        setError(data.message || 'Đăng nhập Google thất bại')
      }
    } catch (err) {
      setError('Có lỗi khi đăng nhập Google')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-tech-blue mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Về trang chủ
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Chào mừng bạn quay trở lại TechNova
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                  placeholder="Nhập email của bạn"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                  placeholder="Nhập mật khẩu của bạn"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tech-blue hover:bg-tech-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tech-blue disabled:opacity-50"
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>

            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-tech-blue hover:text-tech-dark-blue"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-gray-500 text-sm">hoặc</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError('Đăng nhập Google thất bại')}
                shape="pill"
                text="signin_with"
                theme="outline"
              />
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link href="/auth/signup" className="font-medium text-tech-blue hover:text-tech-dark-blue">
                  Đăng ký ngay
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
