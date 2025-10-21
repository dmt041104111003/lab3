'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminTable from '@/components/admin/AdminTable'
import AdminDeleteModal from '@/components/admin/AdminDeleteModal'
import AdminToast from '@/components/admin/AdminToast'
import AdminPagination from '@/components/admin/AdminPagination'
import AdminFilter from '@/components/admin/AdminFilter'

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

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filterBy, setFilterBy] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data)
      } else {
        setError(data.message || 'Không thể tải danh sách người dùng')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tải danh sách người dùng')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setToast(`Đã copy: ${email}`)
      setTimeout(() => setToast(''), 2000)
    } catch (error) {
      setToast('Không thể copy email')
      setTimeout(() => setToast(''), 2000)
    }
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/users?id=${userToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setToast('Xóa người dùng thành công')
        setUsers(users.filter(user => user.id !== userToDelete.id))
        setShowDeleteModal(false)
        setUserToDelete(null)
      } else {
        setToast(data.message || 'Xóa thất bại')
      }
    } catch (error) {
      setToast('Có lỗi xảy ra khi xóa người dùng')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  // Filter and search logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterBy === '' || user.role === filterBy
    
    return matchesSearch && matchesFilter
  })

  // Sort logic
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'email':
        return a.email.localeCompare(b.email)
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'role':
        return a.role.localeCompare(b.role)
      default:
        return 0
    }
  })

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleReset = () => {
    setSearchTerm('')
    setSortBy('')
    setFilterBy('')
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminLoadingState message="Đang tải danh sách người dùng..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Quản lý người dùng"
        description="Danh sách tất cả người dùng trong hệ thống"
      />

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <AdminToast 
        message={toast}
        isVisible={!!toast}
        onClose={() => setToast('')}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Danh sách người dùng ({sortedUsers.length})
          </h2>
        </div>

        <div className="p-6">
          <AdminFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Tìm kiếm theo tên hoặc email..."
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={[
              { value: 'name', label: 'Tên A-Z' },
              { value: 'email', label: 'Email A-Z' },
              { value: 'createdAt', label: 'Ngày tạo mới nhất' },
              { value: 'role', label: 'Vai trò' }
            ]}
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            filterOptions={[
              { value: 'ADMIN', label: 'Quản trị viên' },
              { value: 'USER', label: 'Người dùng' }
            ]}
            onReset={handleReset}
            className="mb-6"
          />
        </div>

        <AdminTable
          columns={[
            { key: 'user', label: 'Người dùng' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Vai trò' },
            { key: 'status', label: 'Trạng thái' },
            { key: 'posts', label: 'Bài viết' },
            { key: 'createdAt', label: 'Ngày tạo' },
            { key: 'actions', label: 'Thao tác' }
          ]}
          data={paginatedUsers}
          renderRow={(user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-tech-blue flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">ID: {user.id.slice(-8)}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => copyEmail(user.email)}
                  className="text-sm text-gray-900 hover:text-tech-blue cursor-pointer max-w-32 truncate"
                  title={user.email}
                >
                  {user.email}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.isBanned ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    {user.bannedUntil ? 'Bị cấm tạm thời' : 'Bị cấm vĩnh viễn'}
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Hoạt động
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user._count.posts} bài viết
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a
                  href={`/admin/users/edit/${user.id}`}
                  className="text-tech-blue hover:text-tech-dark-blue mr-4"
                >
                  Chỉnh sửa
                </a>
                <button 
                  onClick={() => handleDeleteClick(user)}
                  className="text-red-600 hover:text-red-900"
                >
                  Xóa
                </button>
              </td>
            </tr>
          )}
          emptyMessage="Không có người dùng"
          emptyDescription="Chưa có người dùng nào trong hệ thống."
        />

        {users.length > 0 && (
          <div className="mt-6">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={users.length}
            />
          </div>
        )}
      </div>

      <AdminDeleteModal
        isOpen={showDeleteModal}
        title="Xác nhận xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng"
        itemName={userToDelete?.name}
        warningMessage="Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn."
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </AdminLayout>
  )
}
