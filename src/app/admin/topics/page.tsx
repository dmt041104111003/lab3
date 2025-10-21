'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'

interface Topic {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTopic, setNewTopic] = useState({ name: '', description: '' })
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null)

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/topics')
      if (response.ok) {
        const data = await response.json()
        setTopics(data)
      }
    } catch (error) {
      console.error('Error fetching topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTopic)
      })
      
      if (response.ok) {
        setNewTopic({ name: '', description: '' })
        setShowCreateForm(false)
        fetchTopics()
      }
    } catch (error) {
      console.error('Error creating topic:', error)
    }
  }

  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTopic) return

    try {
      const response = await fetch(`/api/topics/${editingTopic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingTopic.name,
          description: editingTopic.description
        })
      })
      
      if (response.ok) {
        setEditingTopic(null)
        fetchTopics()
      }
    } catch (error) {
      console.error('Error updating topic:', error)
    }
  }

  const handleDeleteTopic = async () => {
    if (!deletingTopic) return

    try {
      const response = await fetch(`/api/topics/${deletingTopic.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setDeletingTopic(null)
        fetchTopics()
      }
    } catch (error) {
      console.error('Error deleting topic:', error)
    }
  }

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chủ đề</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Thêm chủ đề mới
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Tìm kiếm chủ đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
          />
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4">Thêm chủ đề mới</h2>
              <form onSubmit={handleCreateTopic}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ đề
                  </label>
                  <input
                    type="text"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    rows={3}
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
                    Tạo chủ đề
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {editingTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4">Chỉnh sửa chủ đề</h2>
              <form onSubmit={handleUpdateTopic}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ đề
                  </label>
                  <input
                    type="text"
                    value={editingTopic.name}
                    onChange={(e) => setEditingTopic({ ...editingTopic, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={editingTopic.description || ''}
                    onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingTopic(null)}
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
        {deletingTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4 text-red-600">Xác nhận xóa chủ đề</h2>
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa chủ đề <strong>"{deletingTopic.name}"</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setDeletingTopic(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteTopic}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Xóa chủ đề
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Topics List */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chủ đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
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
                {filteredTopics.map((topic) => (
                  <tr key={topic.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {topic.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {topic.description || 'Không có mô tả'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(topic.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setEditingTopic(topic)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setDeletingTopic(topic)}
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

        {filteredTopics.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Không tìm thấy chủ đề nào' : 'Chưa có chủ đề nào'}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
