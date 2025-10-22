'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminFormField from '@/components/admin/AdminFormField'
import AdminInput from '@/components/admin/AdminInput'
import AdminButton from '@/components/admin/AdminButton'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminDeleteModal from '@/components/admin/AdminDeleteModal'
import AdminTable from '@/components/admin/AdminTable'
import AdminModal from '@/components/admin/AdminModal'
import AdminPagination from '@/components/admin/AdminPagination'
import AdminFilter from '@/components/admin/AdminFilter'

interface Tag {
  id: string
  name: string
  slug: string
  color: string
  createdAt: string
  updatedAt: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTag, setNewTag] = useState({ name: '', color: '#3B82F6' })
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  
  // Additional filter states
  const [sortBy, setSortBy] = useState('')
  const [filterBy, setFilterBy] = useState('')

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags')
      if (response.ok) {
        const data = await response.json()
        setTags(data)
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTag)
      })
      
      if (response.ok) {
        setNewTag({ name: '', color: '#3B82F6' })
        setShowCreateForm(false)
        fetchTags()
      }
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTag) return

    try {
      const response = await fetch(`/api/tags/${editingTag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingTag.name,
          color: editingTag.color
        })
      })
      
      if (response.ok) {
        setEditingTag(null)
        fetchTags()
      }
    } catch (error) {
      console.error('Error updating tag:', error)
    }
  }

  const handleDeleteTag = async () => {
    if (!deletingTag) return

    try {
      const response = await fetch(`/api/tags/${deletingTag.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setDeletingTag(null)
        fetchTags()
      }
    } catch (error) {
      console.error('Error deleting tag:', error)
    }
  }

  // Filter and search logic
  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterBy === '' || 
                         (filterBy === 'recent' && new Date(tag.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                         (filterBy === 'old' && new Date(tag.createdAt) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    
    return matchesSearch && matchesFilter
  })

  // Sort logic
  const sortedTags = [...filteredTags].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'color':
        return a.color.localeCompare(b.color)
      default:
        return 0
    }
  })

  // Pagination logic
  const totalPages = Math.ceil(sortedTags.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTags = sortedTags.slice(startIndex, endIndex)

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
        <AdminLoadingState message="Đang tải danh sách thẻ..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Quản lý thẻ"

      />
      
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-tech-dark-blue transition-colors"
        >
          Thêm thẻ mới
        </button>
      </div>

      <AdminFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm theo tên thẻ..."
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { value: 'name', label: 'Tên A-Z' },
          { value: 'createdAt', label: 'Ngày tạo mới nhất' },
          { value: 'color', label: 'Màu sắc' }
        ]}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        filterOptions={[
          { value: 'recent', label: 'Thẻ mới (7 ngày qua)' },
          { value: 'old', label: 'Thẻ cũ (trước 7 ngày)' }
        ]}
        onReset={handleReset}
        className="mb-6"
      />

        <AdminModal
          isOpen={showCreateForm}
          title="Thêm thẻ mới"
          onClose={() => setShowCreateForm(false)}
          size="md"
        >
          <form onSubmit={handleCreateTag}>
            <AdminFormField label="Tên thẻ" required>
              <AdminInput
                name="name"
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                required
              />
            </AdminFormField>
            
            <AdminFormField label="Màu sắc">
              <input
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                aria-label="Màu sắc"
              />
            </AdminFormField>
            
            <div className="flex justify-end space-x-2">
              <AdminButton
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Hủy
              </AdminButton>
              <AdminButton type="submit">
                Tạo thẻ
              </AdminButton>
            </div>
          </form>
        </AdminModal>

        <AdminModal
          isOpen={!!editingTag}
          title="Chỉnh sửa thẻ"
          onClose={() => setEditingTag(null)}
          size="md"
        >
          {editingTag && (
            <form onSubmit={handleUpdateTag}>
              <AdminFormField label="Tên thẻ" required>
                <AdminInput
                  name="name"
                  type="text"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  required
                />
              </AdminFormField>
              
              <AdminFormField label="Màu sắc">
                <input
                  type="color"
                  value={editingTag.color}
                  onChange={(e) => setEditingTag({ ...editingTag, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                  aria-label="Màu sắc"
                />
              </AdminFormField>
              
              <div className="flex justify-end space-x-2">
                <AdminButton
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingTag(null)}
                >
                  Hủy
                </AdminButton>
                <AdminButton type="submit">
                  Cập nhật
                </AdminButton>
              </div>
            </form>
          )}
        </AdminModal>

        <AdminDeleteModal
          isOpen={!!deletingTag}
          title="Xác nhận xóa thẻ"
          message="Bạn có chắc chắn muốn xóa thẻ"
          itemName={deletingTag?.name}
          warningMessage="Hành động này không thể hoàn tác."
          onConfirm={handleDeleteTag}
          onCancel={() => setDeletingTag(null)}
        />

        <AdminTable
          columns={[
            { key: 'tag', label: 'Thẻ' },
            { key: 'color', label: 'Màu sắc' },
            { key: 'createdAt', label: 'Ngày tạo' },
            { key: 'actions', label: 'Thao tác' }
          ]}
          data={paginatedTags}
          renderRow={(tag) => (
            <tr key={tag.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: tag.color }}
                    aria-label={`Màu ${tag.color}`}
                    role="presentation"
                  ></span>
                  <div className="text-sm font-medium text-gray-900">
                    {tag.name}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tag.color}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(tag.createdAt).toLocaleDateString('vi-VN')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => setEditingTag(tag)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Sửa
                </button>
                <button
                  onClick={() => setDeletingTag(tag)}
                  className="text-red-600 hover:text-red-900"
                >
                  Xóa
                </button>
              </td>
            </tr>
          )}
          emptyMessage={searchTerm ? 'Không tìm thấy thẻ nào' : 'Chưa có thẻ nào'}
          emptyDescription={searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Tạo thẻ đầu tiên để bắt đầu'}
        />

        {filteredTags.length > 0 && (
          <div className="mt-6">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredTags.length}
            />
          </div>
        )}
    </AdminLayout>
  )
}
