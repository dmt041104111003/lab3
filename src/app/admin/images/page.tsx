'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminFormField from '@/components/admin/AdminFormField'
import AdminInput from '@/components/admin/AdminInput'
import AdminButton from '@/components/admin/AdminButton'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminDeleteModal from '@/components/admin/AdminDeleteModal'
import AdminModal from '@/components/admin/AdminModal'
import AdminPagination from '@/components/admin/AdminPagination'
import AdminToast from '@/components/admin/AdminToast'
import AdminFilter from '@/components/admin/AdminFilter'

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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [toast, setToast] = useState('')
  
  // Additional filter states
  const [sortBy, setSortBy] = useState('')
  const [filterBy, setFilterBy] = useState('')

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

  // Filter and search logic
  const filteredImages = images.filter(image => {
    const matchesSearch = image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (image.alt && image.alt.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterBy === '' || 
                         (filterBy === 'withAlt' && image.alt) ||
                         (filterBy === 'withoutAlt' && !image.alt)
    
    return matchesSearch && matchesFilter
  })

  // Sort logic
  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.originalName.localeCompare(b.originalName)
      case 'size':
        return b.size - a.size
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'alt':
        return (a.alt || '').localeCompare(b.alt || '')
      default:
        return 0
    }
  })

  // Pagination logic
  const totalPages = Math.ceil(sortedImages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedImages = sortedImages.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleReset = () => {
    setSearchTerm('')
    setSortBy('')
    setFilterBy('')
    setCurrentPage(1)
  }

  const copyImageUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setToast(`Đã copy URL: ${url}`)
      setTimeout(() => setToast(''), 2000)
    } catch (error) {
      setToast('Không thể copy URL')
      setTimeout(() => setToast(''), 2000)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <AdminLoadingState message="Đang tải danh sách hình ảnh..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Quản lý hình ảnh"
  
      />
      
      <div className="mb-6">
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-tech-dark-blue"
        >
          Tải lên hình ảnh
        </button>
      </div>

      <AdminFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm theo tên file hoặc alt text..."
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { value: 'name', label: 'Tên file A-Z' },
          { value: 'size', label: 'Kích thước lớn nhất' },
          { value: 'createdAt', label: 'Ngày tải lên mới nhất' },
          { value: 'alt', label: 'Alt text A-Z' }
        ]}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        filterOptions={[
          { value: 'withAlt', label: 'Có alt text' },
          { value: 'withoutAlt', label: 'Không có alt text' }
        ]}
        onReset={handleReset}
        className="mb-6"
      />

      <AdminToast 
        message={toast}
        isVisible={!!toast}
        onClose={() => setToast('')}
      />

        <AdminModal
          isOpen={showUploadForm}
          title="Tải lên hình ảnh"
          onClose={() => setShowUploadForm(false)}
          size="md"
        >
          <form onSubmit={handleUpload}>
            <AdminFormField label="Chọn file" required>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                aria-label="Chọn file hình ảnh"
              />
            </AdminFormField>
            
            <AdminFormField label="Alt text">
              <AdminInput
                name="altText"
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Mô tả hình ảnh"
              />
            </AdminFormField>
            
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
              <AdminButton
                type="button"
                variant="secondary"
                onClick={() => setShowUploadForm(false)}
                disabled={uploading}
              >
                Hủy
              </AdminButton>
              <AdminButton
                type="submit"
                loading={uploading}
                disabled={uploading || !selectedFile}
              >
                Tải lên
              </AdminButton>
            </div>
          </form>
        </AdminModal>

        <AdminDeleteModal
          isOpen={!!deletingImage}
          title="Xác nhận xóa hình ảnh"
          message="Bạn có chắc chắn muốn xóa hình ảnh"
          itemName={deletingImage?.originalName}
          warningMessage="Hành động này sẽ xóa hình ảnh khỏi Cloudinary và không thể hoàn tác."
          onConfirm={handleDeleteImage}
          onCancel={() => setDeletingImage(null)}
        />

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedImages.map((image) => (
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
                    onClick={() => copyImageUrl(image.path)}
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

        {filteredImages.length > 0 && (
          <div className="mt-6">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredImages.length}
            />
          </div>
        )}
    </AdminLayout>
  )
}
