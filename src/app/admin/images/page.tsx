'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'

interface Image {
  id: string
  filename: string
  originalName: string
  path: string
  size: number
  mimeType: string
  alt: string | null
  createdAt: string
  updatedAt: string
}

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [deletingImage, setDeletingImage] = useState<Image | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images')
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setAltText(file.name.split('.')[0]) // Use filename as default alt text
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('alt', altText)

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        setSelectedFile(null)
        setAltText('')
        setShowUploadForm(false)
        fetchImages()
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!deletingImage) return

    try {
      const response = await fetch(`/api/images/${deletingImage.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setDeletingImage(null)
        fetchImages()
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredImages = images.filter(image =>
    image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (image.alt && image.alt.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý hình ảnh</h1>
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Tải lên hình ảnh
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Tìm kiếm hình ảnh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
          />
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4">Tải lên hình ảnh</h2>
              <form onSubmit={handleUpload}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn file
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt text
                  </label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    placeholder="Mô tả hình ảnh"
                  />
                </div>
                {selectedFile && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">
                      <p>File: {selectedFile.name}</p>
                      <p>Size: {formatFileSize(selectedFile.size)}</p>
                      <p>Type: {selectedFile.type}</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    disabled={uploading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={uploading || !selectedFile}
                  >
                    {uploading ? 'Đang tải lên...' : 'Tải lên'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4 text-red-600">Xác nhận xóa hình ảnh</h2>
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa hình ảnh <strong>"{deletingImage.originalName}"</strong>? 
                Hành động này sẽ xóa hình ảnh khỏi Cloudinary và không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setDeletingImage(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteImage}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Xóa hình ảnh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={image.path}
                  alt={image.alt || image.originalName}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-image.png'
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {image.originalName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(image.size)} • {image.mimeType}
                </p>
                {image.alt && (
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    Alt: {image.alt}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(image.createdAt).toLocaleDateString('vi-VN')}
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(image.path)}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => setDeletingImage(image)}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Không tìm thấy hình ảnh nào' : 'Chưa có hình ảnh nào'}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
