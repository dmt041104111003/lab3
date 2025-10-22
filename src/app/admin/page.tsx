'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStatsCard from '@/components/admin/AdminStatsCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminTable from '@/components/admin/AdminTable'

interface Post {
  id: string
  title: string
  published: boolean
  createdAt: string
  author: {
    name: string
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface Stats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalUsers: number
  adminUsers: number
  regularUsers: number
  recentPosts: Post[]
  recentUsers: User[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [postsRes, usersRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/users')
      ])

      const [posts, users] = await Promise.all([
        postsRes.json(),
        usersRes.json()
      ])

      const publishedPosts = posts.filter((post: Post) => post.published)
      const draftPosts = posts.filter((post: Post) => !post.published)
      const adminUsers = users.filter((user: User) => user.role === 'ADMIN')
      const regularUsers = users.filter((user: User) => user.role === 'USER')

      setStats({
        totalPosts: posts.length,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        totalUsers: users.length,
        adminUsers: adminUsers.length,
        regularUsers: regularUsers.length,
        recentPosts: posts.slice(0, 5),
        recentUsers: users.slice(0, 5)
      })
    } catch (error) {
      setError('Có lỗi xảy ra khi tải thống kê')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <AdminLoadingState message="Đang tải thống kê..." />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </AdminLayout>
    )
  }

  if (!stats) return null

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Dashboard"
        description="Tổng quan hệ thống quản trị"
      />

      {/* Stats Summary - 1 dòng */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-center items-center space-x-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.totalPosts}
            </div>
            <div className="text-sm text-gray-600">Tổng bài viết</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-gray-600">Tổng người dùng</div>
          </div>
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Bài viết gần đây</h2>
            <a
              href="/admin/posts"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Xem tất cả
            </a>
          </div>
        </div>
        <AdminTable
          columns={[
            { key: 'title', label: 'Tiêu đề' },
            { key: 'author', label: 'Tác giả' },
            { key: 'status', label: 'Trạng thái' },
            { key: 'createdAt', label: 'Ngày tạo' }
          ]}
          data={stats.recentPosts}
          renderRow={(post) => (
            <tr key={post.id}>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {post.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {post.author.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  post.published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.published ? 'Đã xuất bản' : 'Bản nháp'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </td>
            </tr>
          )}
          emptyMessage="Không có bài viết"
          emptyDescription="Chưa có bài viết nào trong hệ thống."
        />
      </div>

      {/* Recent Users Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Người dùng gần đây</h2>
            <a
              href="/admin/users"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Xem tất cả
            </a>
          </div>
        </div>
        <AdminTable
          columns={[
            { key: 'name', label: 'Tên' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Vai trò' },
            { key: 'createdAt', label: 'Ngày tạo' }
          ]}
          data={stats.recentUsers}
          renderRow={(user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'ADMIN' ? 'Quản trị' : 'Người dùng'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </td>
            </tr>
          )}
          emptyMessage="Không có người dùng"
          emptyDescription="Chưa có người dùng nào trong hệ thống."
        />
      </div>
    </AdminLayout>
  )
}
