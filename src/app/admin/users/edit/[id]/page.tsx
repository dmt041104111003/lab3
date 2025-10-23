'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCard from '@/components/admin/AdminCard'
import AdminFormField from '@/components/admin/AdminFormField'
import AdminInput from '@/components/admin/AdminInput'
import AdminSelect from '@/components/admin/AdminSelect'
import AdminCheckbox from '@/components/admin/AdminCheckbox'
import AdminButton from '@/components/admin/AdminButton'
import AdminErrorAlert from '@/components/admin/AdminErrorAlert'
import AdminLoadingState from '@/components/admin/AdminLoadingState'

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

  const fetchUser = useCallback(async () => {
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
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId, fetchUser])

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
        <AdminLoadingState message="Đang tải thông tin người dùng..." />
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
      <AdminPageHeader 
        title="Chỉnh sửa người dùng"
        description="Cập nhật thông tin và quyền hạn của người dùng"
        backButton={{
          text: "Quay lại danh sách người dùng",
          href: "/admin/users"
        }}
      />

      <AdminErrorAlert message={error} />
      
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <AdminCard title="Thông tin người dùng">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <AdminFormField label="Tên người dùng">
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 text-gray-500 border border-gray-300 rounded-md"
                  aria-label="Tên người dùng"
                />
              </AdminFormField>

              <AdminFormField label="Email">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 text-gray-500 border border-gray-300 rounded-md"
                  aria-label="Email"
                />
              </AdminFormField>

              <AdminFormField label="Số bài viết">
                <input
                  type="text"
                  value={`${user._count.posts} bài viết`}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 text-gray-500 border border-gray-300 rounded-md"
                  aria-label="Số bài viết"
                />
              </AdminFormField>
            </div>

            <div className="space-y-4">
              <AdminFormField label="Vai trò" required>
                <AdminSelect
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={[
                    { value: 'USER', label: 'Người dùng' },
                    { value: 'ADMIN', label: 'Quản trị viên' }
                  ]}
                  required
                />
              </AdminFormField>

              <AdminCheckbox
                name="isBanned"
                checked={formData.isBanned}
                onChange={handleChange}
                label="Cấm người dùng"
              />

              {formData.isBanned && (
                <div>
                  <AdminCheckbox
                    name="hasBannedUntil"
                    checked={formData.hasBannedUntil}
                    onChange={handleChange}
                    label="Cấm có thời hạn"
                  />

                  {formData.hasBannedUntil && (
                    <AdminFormField label="Ngày hết hạn cấm">
                      <input
                        type="datetime-local"
                        name="bannedUntil"
                        value={formData.bannedUntil}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                        aria-label="Ngày hết hạn cấm"
                      />
                    </AdminFormField>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin/users')}
            >
              Hủy
            </AdminButton>
            <AdminButton
              type="submit"
              loading={isSaving}
              disabled={isSaving}
            >
              Lưu thay đổi
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </AdminLayout>
  )
}
