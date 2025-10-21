'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCard from '@/components/admin/AdminCard'
import AdminFormField from '@/components/admin/AdminFormField'
import AdminInput from '@/components/admin/AdminInput'
import AdminButton from '@/components/admin/AdminButton'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminDeleteModal from '@/components/admin/AdminDeleteModal'
import AdminTable from '@/components/admin/AdminTable'
import AdminModal from '@/components/admin/AdminModal'
import AdminPagination from '@/components/admin/AdminPagination'

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

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredTags.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTags = filteredTags.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
        actionButton={{
          text: "Thêm thẻ mới",
          onClick: () => setShowCreateForm(true)
        }}
      />

      <AdminCard>
        <AdminFormField label="Tìm kiếm thẻ">
          <AdminInput
            type="text"
            placeholder="Tìm kiếm thẻ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </AdminFormField>
      </AdminCard>

        <AdminModal
          isOpen={showCreateForm}
          title="Thêm thẻ mới"
          onClose={() => setShowCreateForm(false)}
          size="md"
        >
          <form onSubmit={handleCreateTag}>
            <AdminFormField label="Tên thẻ" required>
              <AdminInput
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                required
              />
            </AdminFormField>
            
            <AdminFormField label="Màu sắc">
              <AdminInput
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                className="w-full h-10"
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
                  type="text"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  required
                />
              </AdminFormField>
              
              <AdminFormField label="Màu sắc">
                <AdminInput
                  type="color"
                  value={editingTag.color}
                  onChange={(e) => setEditingTag({ ...editingTag, color: e.target.value })}
                  className="w-full h-10"
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
