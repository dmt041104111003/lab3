'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-blue"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thẻ</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Thêm thẻ mới
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Tìm kiếm thẻ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
          />
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4">Thêm thẻ mới</h2>
              <form onSubmit={handleCreateTag}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên thẻ
                  </label>
                  <input
                    type="text"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu sắc
                  </label>
                  <input
                    type="color"
                    value={newTag.color}
                    onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Tạo thẻ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {editingTag && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4">Chỉnh sửa thẻ</h2>
              <form onSubmit={handleUpdateTag}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên thẻ
                  </label>
                  <input
                    type="text"
                    value={editingTag.name}
                    onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu sắc
                  </label>
                  <input
                    type="color"
                    value={editingTag.color}
                    onChange={(e) => setEditingTag({ ...editingTag, color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingTag(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingTag && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4 text-red-600">Xác nhận xóa thẻ</h2>
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa thẻ <strong>"{deletingTag.name}"</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setDeletingTag(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteTag}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Xóa thẻ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tags List */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thẻ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Màu sắc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTags.map((tag) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTags.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Không tìm thấy thẻ nào' : 'Chưa có thẻ nào'}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
