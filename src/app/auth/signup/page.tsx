'use client'

import { useState } from "react"
import Link from "next/link"

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateForm = () => {
    // Check required fields
    if (!formData.name.trim()) {
      setError('Họ và tên là bắt buộc')
      return false
    }

    if (!formData.email.trim()) {
      setError('Email là bắt buộc')
      return false
    }

    if (!formData.password.trim()) {
      setError('Mật khẩu là bắt buộc')
      return false
    }

    if (!formData.confirmPassword.trim()) {
      setError('Xác nhận mật khẩu là bắt buộc')
      return false
    }

    // Name validation
    if (formData.name.trim().length < 2) {
      setError('Họ và tên phải có ít nhất 2 ký tự')
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }

    if (formData.password.length > 50) {
      setError('Mật khẩu không được quá 50 ký tự')
      return false
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/
    if (!passwordRegex.test(formData.password)) {
      setError('Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số')
      return false
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Auto login after successful signup with server-side cookie
        localStorage.setItem('user_session', JSON.stringify(data.user))
        
        // Set cookie via API
        try {
          await fetch('/api/set-cookie', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: data.user }),
          })
        } catch (error) {
          console.log('Error setting cookie:', error)
        }
        
        if (data.user.role === 'ADMIN') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/'
        }
      } else {
        setError(data.message || 'Đăng ký thất bại')
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
          Đăng ký
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tham gia cộng đồng TechNova
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
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
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                  placeholder="Tối thiểu 6 ký tự, bao gồm chữ và số"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Mật khẩu phải có ít nhất 6 ký tự và chứa cả chữ cái và số
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tech-blue hover:bg-tech-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tech-blue disabled:opacity-50"
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link href="/auth/signin" className="font-medium text-tech-blue hover:text-tech-dark-blue">
                  Đăng nhập
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
