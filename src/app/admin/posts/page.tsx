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
import {  getCategoryById, getSubcategoryById } from '@/lib/categories'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  published: boolean
  createdAt: string
  category?: string
  subcategory?: string
  author: {
    name: string
    email: string
  }
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filterBy, setFilterBy] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts?id=${postToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setToast('Xóa bài viết thành công')
        setPosts(posts.filter(post => post.id !== postToDelete.id))
        setShowDeleteModal(false)
        setPostToDelete(null)
      } else {
        setToast(data.message || 'Xóa thất bại')
      }
    } catch (error) {
      setToast('Có lỗi xảy ra khi xóa bài viết')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setPostToDelete(null)
  }

  // Filter and search logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterBy === '' || post.category === filterBy
    
    return matchesSearch && matchesFilter
  })

  // Sort logic
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'author':
        return a.author.name.localeCompare(b.author.name)
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'published':
        return Number(b.published) - Number(a.published)
      default:
        return 0
    }
  })

  // Pagination logic
  const totalPages = Math.ceil(sortedPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleReset = () => {
    setSearchTerm('')
    setSortBy('')
    setFilterBy('')
    setCurrentPage(1)
  }


  if (loading) {
    return (
      <AdminLayout>
        <AdminLoadingState message="Đang tải danh sách bài viết..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Quản lý bài viết"
        description="Tạo, chỉnh sửa và quản lý nội dung bài viết"
        actionButton={{
          text: "Tạo bài viết mới",
          href: "/admin/posts/create"
        }}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Danh sách bài viết</h2>
        </div>

        <div className="p-6">
          <AdminFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={[
              { value: 'title', label: 'Tiêu đề A-Z' },
              { value: 'author', label: 'Tác giả A-Z' },
              { value: 'createdAt', label: 'Ngày tạo mới nhất' },
              { value: 'published', label: 'Trạng thái xuất bản' }
            ]}
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            filterOptions={[
              { value: 'ai-chuyen-doi-so', label: 'AI – Chuyển đổi số' },
              { value: 'doi-moi-sang-tao', label: 'Đổi mới sáng tạo' },
              { value: 'san-pham-review', label: 'Sản phẩm & Review' },
              { value: 'xu-huong-tuong-lai', label: 'Xu hướng tương lai' }
            ]}
            onReset={handleReset}
            className="mb-6"
          />
        </div>

        <AdminTable
          columns={[
            { key: 'title', label: 'Tiêu đề' },
            { key: 'status', label: 'Trạng thái' },
            { key: 'category', label: 'Chuyên mục' },
            { key: 'author', label: 'Tác giả' },
            { key: 'createdAt', label: 'Ngày tạo' },
            { key: 'actions', label: 'Thao tác' }
          ]}
          data={paginatedPosts}
          renderRow={(post) => (
            <tr key={post.id}>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={post.title}>
                  {post.title}
                </div>
                {post.excerpt && (
                  <div className="text-sm text-gray-500 mt-1 truncate max-w-xs" title={post.excerpt}>
                    {post.excerpt}
                  </div>
                )}
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
                {post.category && post.subcategory ? (
                  <div>
                    <div className="font-medium text-gray-900">
                      {getCategoryById(post.category)?.name || post.category}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getSubcategoryById(post.subcategory)?.name || post.subcategory}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Chưa phân loại</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {post.author.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <a
                  href={`/admin/posts/edit/${post.slug}`}
                  className="text-tech-blue hover:text-tech-dark-blue"
                >
                  Sửa
                </a>
                <button
                  onClick={() => handleDeleteClick(post)}
                  className="text-red-600 hover:text-red-900"
                >
                  Xóa
                </button>
              </td>
            </tr>
          )}
          emptyMessage="Không có bài viết"
          emptyDescription="Chưa có bài viết nào trong hệ thống."
        />

        {posts.length > 0 && (
          <div className="mt-6">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={posts.length}
            />
          </div>
        )}
      </div>


      <AdminToast 
        message={toast}
        isVisible={!!toast}
        onClose={() => setToast('')}
      />

      <AdminDeleteModal
        isOpen={showDeleteModal}
        title="Xác nhận xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết"
        itemName={postToDelete?.title}
        warningMessage="Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn."
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </AdminLayout>
  )
}
