'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
// import AdminStatsCard from '@/components/admin/AdminStatsCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminTable from '@/components/admin/AdminTable'
import { DonutChart, BarChart } from '@/components/admin/AdminChart'
import StockChart from '@/components/admin/StockChart'

interface Post {
  id: string
  title: string
  published: boolean
  createdAt: string
  authorName?: string
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Bài viết Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <DonutChart
            title="Tổng bài viết"
            total={stats.totalPosts}
            data={[
              {
                label: 'Đã xuất bản',
                value: stats.publishedPosts,
                color: '#10b981'
              },
              {
                label: 'Bản nháp',
                value: stats.draftPosts,
                color: '#f59e0b'
              }
            ]}
          />
        </div>

        {/* Người dùng Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <DonutChart
            title="Tổng người dùng"
            total={stats.totalUsers}
            data={[
              {
                label: 'Quản trị',
                value: stats.adminUsers,
                color: '#8b5cf6'
              },
              {
                label: 'Người dùng',
                value: stats.regularUsers,
                color: '#3b82f6'
              }
            ]}
          />
        </div>
      </div>

      {/* Stock Chart Analytics */}
      <div className="mb-8">
        <StockChart days={14} />
      </div>

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
            <>
              {/* Desktop Table Row */}
              <tr key={post.id} className="hidden md:table-row">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={post.title}>
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.authorName || post.author.name}
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
              
              {/* Mobile Card */}
              <div key={`mobile-${post.id}`} className="md:hidden">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900 flex-1 mr-2 leading-relaxed line-clamp-2" title={post.title}>
                      {post.title}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                      post.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1 text-xs text-gray-500">
                    <div>Tác giả: {post.authorName || post.author.name}</div>
                    <div>Ngày tạo: {new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
              </div>
            </>
          )}
          emptyMessage="Không có bài viết"
          emptyDescription="Chưa có bài viết nào trong hệ thống."
        />
      </div>

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
            <>
              {/* Desktop Table Row */}
              <tr key={user.id} className="hidden md:table-row">
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
              
              {/* Mobile Card */}
              <div key={`mobile-${user.id}`} className="md:hidden">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'ADMIN' ? 'Quản trị' : 'Người dùng'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>Email: {user.email}</div>
                    <div>Ngày tạo: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
              </div>
            </>
          )}
          emptyMessage="Không có người dùng"
          emptyDescription="Chưa có người dùng nào trong hệ thống."
        />
      </div>
    </AdminLayout>
  )
}
