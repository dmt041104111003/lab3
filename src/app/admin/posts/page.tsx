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
  authorName?: string
  author: {
    name: string
    email: string
  }
  _count: {
    views: number
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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.authorName || post.author.name).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterBy === '' || post.category === filterBy
    
    return matchesSearch && matchesFilter
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'author':
        return (a.authorName || a.author.name).localeCompare(b.authorName || b.author.name)
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'published':
        return Number(b.published) - Number(a.published)
      default:
        return 0
    }
  })

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
      />

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Danh sách bài viết</h2>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <a
              href="/admin/posts/create"
              className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-tech-dark-blue transition-colors inline-block w-full sm:w-auto text-center sm:text-left"
            >
              Thêm bài viết mới
            </a>
          </div>

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
            { key: 'viewCount', label: 'Lượt xem' },
            { key: 'createdAt', label: 'Ngày tạo' },
            { key: 'actions', label: 'Thao tác' }
          ]}
          data={paginatedPosts}
          renderRow={(post) => (
            <>
              {/* Desktop Table Row */}
              <tr key={post.id} className="hidden md:table-row">
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
                  {post.category ? (
                    <div className="max-w-32">
                      <div className="font-medium text-gray-900 truncate" title={`${getCategoryById(post.category)?.name || post.category}${post.subcategory && post.subcategory.trim() !== '' ? ' - ' + (getSubcategoryById(post.subcategory)?.name || post.subcategory) : ''}`}>
                        {getCategoryById(post.category)?.name || post.category}
                      </div>
                      {post.subcategory && post.subcategory.trim() !== '' && (
                        <div className="text-xs text-gray-500 truncate" title={getSubcategoryById(post.subcategory)?.name || post.subcategory}>
                          {getSubcategoryById(post.subcategory)?.name || post.subcategory}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">Chưa phân loại</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.authorName || post.author.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {post._count.views}
                  </span>
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
              
              {/* Mobile Card */}
              <div key={`mobile-${post.id}`} className="md:hidden">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="text-sm font-medium text-gray-900 leading-relaxed line-clamp-2" title={post.title}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2" title={post.excerpt}>
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                      post.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Chuyên mục:</span>
                      <div className="text-xs text-gray-900 text-right max-w-32">
                        {post.category ? (
                          <div>
                            <div className="font-medium truncate" title={`${getCategoryById(post.category)?.name || post.category}${post.subcategory && post.subcategory.trim() !== '' ? ' - ' + (getSubcategoryById(post.subcategory)?.name || post.subcategory) : ''}`}>
                              {getCategoryById(post.category)?.name || post.category}
                            </div>
                            {post.subcategory && post.subcategory.trim() !== '' && (
                              <div className="text-gray-500 truncate" title={getSubcategoryById(post.subcategory)?.name || post.subcategory}>
                                {getSubcategoryById(post.subcategory)?.name || post.subcategory}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Chưa phân loại</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Tác giả:</span>
                      <span className="text-xs text-gray-900">{post.authorName || post.author.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Lượt xem:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post._count.views}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Ngày tạo:</span>
                      <span className="text-xs text-gray-900">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <a
                        href={`/admin/posts/edit/${post.slug}`}
                        className="text-tech-blue hover:text-tech-dark-blue text-xs"
                      >
                        Sửa
                      </a>
                      <button
                        onClick={() => handleDeleteClick(post)}
                        className="text-red-600 hover:text-red-900 text-xs"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
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
