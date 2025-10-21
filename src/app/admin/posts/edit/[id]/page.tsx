'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { CATEGORIES, type Category, type Subcategory } from '@/lib/categories'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  published: boolean
  createdAt: string
  author: {
    name: string
    email: string
  }
  tags?: Array<{ id: string; name: string; color: string }>
  featuredImage?: { id: string; originalName: string; path: string; alt: string | null }
  category?: string
  subcategory?: string
}

interface Tag {
  id: string
  name: string
  color: string
}


interface Image {
  id: string
  originalName: string
  path: string
  alt: string | null
}

export default function EditPost() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    selectedTags: [] as string[],
    selectedImage: '',
    imageType: 'existing' as 'existing' | 'upload' | 'url',
    newImageFile: null as File | null,
    imageUrl: '',
    category: '',
    subcategory: ''
  })
  const [tags, setTags] = useState<Tag[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (postId) {
      fetchPost()
      fetchData()
    }
  }, [postId])

  const fetchData = async () => {
    try {
      const [tagsRes, imagesRes] = await Promise.all([
        fetch('/api/tags'),
        fetch('/api/images')
      ])

      const [tagsData, imagesData] = await Promise.all([
        tagsRes.json(),
        imagesRes.json()
      ])

      setTags(tagsData)
      setImages(imagesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const fetchPost = async () => {
    try {
      const response = await fetch('/api/posts')
      const posts = await response.json()
      const postData = posts.find((p: Post) => p.id === postId)
      
      if (postData) {
        setPost(postData)
        setFormData({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          published: postData.published,
          selectedTags: postData.tags?.map(tag => tag.id) || [],
          selectedImage: postData.featuredImage?.id || '',
          category: postData.category || '',
          subcategory: postData.subcategory || ''
        })
      } else {
        setError('Không tìm thấy bài viết')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tải thông tin bài viết')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: postId,
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          published: formData.published,
          selectedTags: formData.selectedTags,
          selectedImage: formData.selectedImage,
          imageType: formData.imageType,
          imageUrl: formData.imageUrl,
          category: formData.category,
          subcategory: formData.subcategory
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Cập nhật bài viết thành công')
        setTimeout(() => {
          router.push('/admin/posts')
        }, 1500)
      } else {
        setError(data.message || 'Cập nhật thất bại')
      }
    } catch (error) {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }



  const handleImageTypeChange = (type: 'existing' | 'upload' | 'url') => {
    setFormData({
      ...formData,
      imageType: type,
      selectedImage: '',
      newImageFile: null,
      imageUrl: ''
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        newImageFile: file
      })
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tech-blue"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin bài viết...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
          <button
            onClick={() => router.push('/admin/posts')}
            className="bg-tech-blue text-white px-4 py-2 rounded-md hover:bg-tech-dark-blue"
          >
            Quay lại danh sách
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
        <p className="mt-2 text-gray-600">Cập nhật thông tin bài viết</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Thông tin bài viết</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Post Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tác giả
                </label>
                <input
                  type="text"
                  value={post.author.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email tác giả
                </label>
                <input
                  type="email"
                  value={post.author.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày tạo
                </label>
                <input
                  type="text"
                  value={new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            {/* Post Settings */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Xuất bản bài viết
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Bài viết sẽ hiển thị công khai khi được xuất bản
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề bài viết <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả ngắn
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                placeholder="Nhập mô tả ngắn về bài viết"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung bài viết <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                placeholder="Viết nội dung bài viết..."
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chuyên mục <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  category: e.target.value,
                  subcategory: '' // Reset subcategory when category changes
                })
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
              required
            >
              <option value="">Chọn chuyên mục</option>
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Selection */}
          {formData.category && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiểu mục <span className="text-red-500">*</span>
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                required
              >
                <option value="">Chọn tiểu mục</option>
                {CATEGORIES.find(cat => cat.id === formData.category)?.subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tags Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thẻ (Tags)
            </label>
            {loadingData ? (
              <div className="text-sm text-gray-500">Đang tải thẻ...</div>
            ) : (
              <select
                name="selectedTags"
                value={formData.selectedTags[0] || ''}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    selectedTags: e.target.value ? [e.target.value] : []
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
              >
                <option value="">Chọn thẻ (tùy chọn)</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id} style={{ color: tag.color }}>
                    {tag.name}
                  </option>
                ))}
              </select>
            )}
          </div>


          {/* Featured Image Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh nổi bật
            </label>
            
            {/* Image Type Selection */}
            <div className="mb-4">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    value="existing"
                    checked={formData.imageType === 'existing'}
                    onChange={(e) => handleImageTypeChange('existing')}
                    className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300"
                  />
                  <span className="ml-2 text-sm">Chọn từ thư viện</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    value="upload"
                    checked={formData.imageType === 'upload'}
                    onChange={(e) => handleImageTypeChange('upload')}
                    className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300"
                  />
                  <span className="ml-2 text-sm">Tải lên ảnh mới</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    value="url"
                    checked={formData.imageType === 'url'}
                    onChange={(e) => handleImageTypeChange('url')}
                    className="h-4 w-4 text-tech-blue focus:ring-tech-blue border-gray-300"
                  />
                  <span className="ml-2 text-sm">Dán link ảnh</span>
                </label>
              </div>
            </div>

            {/* Existing Images */}
            {formData.imageType === 'existing' && (
              <>
                {loadingData ? (
                  <div className="text-sm text-gray-500">Đang tải hình ảnh...</div>
                ) : (
                  <select
                    name="selectedImage"
                    value={formData.selectedImage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                  >
                    <option value="">Chọn hình ảnh (tùy chọn)</option>
                    {images.map((image) => (
                      <option key={image.id} value={image.id}>
                        {image.originalName} {image.alt && `(${image.alt})`}
                      </option>
                    ))}
                  </select>
                )}
                {formData.selectedImage && (
                  <div className="mt-2">
                    {(() => {
                      const selectedImage = images.find(img => img.id === formData.selectedImage)
                      return selectedImage ? (
                        <div className="flex items-center space-x-2">
                          <img
                            src={selectedImage.path}
                            alt={selectedImage.alt || selectedImage.originalName}
                            className="w-16 h-16 object-cover rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder-image.png'
                            }}
                          />
                          <span className="text-sm text-gray-600">{selectedImage.originalName}</span>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </>
            )}

            {/* Upload New Image */}
            {formData.imageType === 'upload' && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                />
                {formData.newImageFile && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={URL.createObjectURL(formData.newImageFile)}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <div>
                        <p className="text-sm font-medium">{formData.newImageFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(formData.newImageFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image URL */}
            {formData.imageType === 'url' && (
              <div>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tech-blue focus:border-tech-blue"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-image.png'
                        }}
                      />
                      <span className="text-sm text-gray-600">Hình ảnh từ URL</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/posts')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-tech-blue rounded-md hover:bg-tech-dark-blue disabled:opacity-50"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
