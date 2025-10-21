'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

interface User {
  id: string
  name: string
  email: string
  role: string
  isBanned: boolean
  bannedUntil: string | null
  createdAt: string
  updatedAt: string
  _count: {
    posts: number
  }
}

export default function EditUser() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    role: 'USER',
    isBanned: false,
    bannedUntil: '',
    hasBannedUntil: false
  })

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/users')
      const users = await response.json()
      const userData = users.find((u: User) => u.id === userId)
      
      if (userData) {
        setUser(userData)
        setFormData({
          role: userData.role,
          isBanned: userData.isBanned,
          bannedUntil: userData.bannedUntil ? new Date(userData.bannedUntil).toISOString().slice(0, 16) : '',
          hasBannedUntil: !!userData.bannedUntil
        })
      } else {
        setError('Không tìm thấy người dùng')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tải thông tin người dùng')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const updateData = {
        id: userId,
        role: formData.role,
        isBanned: formData.isBanned,
        bannedUntil: formData.isBanned && formData.hasBannedUntil ? formData.bannedUntil : null
      }

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Cập nhật người dùng thành công')
        setTimeout(() => {
          router.push('/admin/users')
        }, 1500)
      } else {
        setError(data.message || 'Cập nhật thất bại')
      }
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tech-blue"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin người dùng...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy người dùng</h1>
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-tech-dark-blue"
          >
            Quay lại danh sách
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
        <p className="mt-2 text-gray-600">Cập nhật thông tin và quyền hạn của người dùng</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Thông tin người dùng</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số bài viết
                </label>
                <input
                  type="text"
                  value={`${user._count.posts} bài viết`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                  required
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isBanned"
                    checked={formData.isBanned}
                    onChange={handleChange}
                    className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Cấm người dùng
                  </span>
                </label>
              </div>

              {formData.isBanned && (
                <div>
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="hasBannedUntil"
                      checked={formData.hasBannedUntil}
                      onChange={handleChange}
                      className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Cấm có thời hạn
                    </span>
                  </label>

                  {formData.hasBannedUntil && (
                    <input
                      type="datetime-local"
                      name="bannedUntil"
                      value={formData.bannedUntil}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/users')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-tech-blue rounded-md hover:bg-tech-dark-blue disabled:opacity-50"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
