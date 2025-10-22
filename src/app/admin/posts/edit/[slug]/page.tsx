'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminCard from '@/components/admin/AdminCard'
import AdminFormField from '@/components/admin/AdminFormField'
import AdminInput from '@/components/admin/AdminInput'
import TiptapEditor from '@/components/TiptapEditor'
import AdminTextarea from '@/components/admin/AdminTextarea'
import AdminSelect from '@/components/admin/AdminSelect'
import AdminCheckbox from '@/components/admin/AdminCheckbox'
import AdminButton from '@/components/admin/AdminButton'
import AdminErrorAlert from '@/components/admin/AdminErrorAlert'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import { CATEGORIES, type Category, type Subcategory } from '@/lib/categories'
import { generateSlug } from '@/lib/slug'

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
  const postSlug = params.slug as string

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [titleError, setTitleError] = useState('')

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
    if (postSlug) {
      fetchPost()
      fetchData()
    }
  }, [postSlug])

  const fetchData = useCallback(async () => {
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
  }, [])

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch('/api/posts')
      const posts = await response.json()
      const postData = posts.find((p: Post) => p.slug === postSlug)
      
      if (postData) {
        setPost(postData)
        
        setFormData({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          published: postData.published,
          selectedTags: postData.tags?.map((tag: any) => tag.tag?.id || tag.id) || [],
          selectedImage: postData.images?.[0]?.image?.id || '',
          category: postData.category || '',
          subcategory: postData.subcategory || '',
          imageType: 'existing' as 'existing' | 'upload' | 'url',
          newImageFile: null,
          imageUrl: ''
        })
      } else {
        setError('Không tìm thấy bài viết')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tải thông tin bài viết')
    } finally {
      setIsLoading(false)
    }
  }, [postSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')
    setTitleError('')

    // Validate title before submit
    const titleValidationError = await validateTitle(formData.title)
    if (titleValidationError) {
      setTitleError(titleValidationError)
      setIsSaving(false)
      return
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: post?.id,
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

  const validateTitle = async (title: string) => {
    if (!title.trim()) {
      return 'Tiêu đề không được để trống'
    }
    
    // Check for duplicate title (excluding current post)
    try {
      const response = await fetch('/api/posts')
      const posts = await response.json()
      const isDuplicate = posts.some((p: any) => 
        p.id !== post?.id && 
        p.title.toLowerCase().trim() === title.toLowerCase().trim()
      )
      
      if (isDuplicate) {
        return 'Tiêu đề này đã tồn tại, vui lòng chọn tiêu đề khác'
      }
    } catch (error) {
      console.error('Error checking title:', error)
    }
    
    return ''
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
      
      // Validate title when it changes (with debounce)
      if (name === 'title') {
        setTitleError('') // Clear previous error
        if (value.trim()) {
          // Debounce the validation
          const timeoutId = setTimeout(async () => {
            const error = await validateTitle(value)
            setTitleError(error)
          }, 500)
          
          return () => clearTimeout(timeoutId)
        }
      }
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
        <AdminLoadingState message="Đang tải thông tin bài viết..." />
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
      <AdminPageHeader 
        title="Chỉnh sửa bài viết"
        description="Cập nhật thông tin bài viết"
        backButton={{
          text: "Quay lại danh sách bài viết",
          href: "/admin/posts"
        }}
      />

      <AdminErrorAlert message={error} />
      
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <AdminCard title="Thông tin bài viết">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Post Info */}
            <div className="space-y-4">
              <AdminFormField label="Tác giả">
                <input
                  type="text"
                  value={post.author.name}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 text-gray-500 border border-gray-300 rounded-md"
                  aria-label="Tác giả"
                />
              </AdminFormField>

              <AdminFormField label="Email tác giả">
                <input
                  type="email"
                  value={post.author.email}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 text-gray-500 border border-gray-300 rounded-md"
                  aria-label="Email tác giả"
                />
              </AdminFormField>

              <AdminFormField label="Ngày tạo">
                <input
                  type="text"
                  value={new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 text-gray-500 border border-gray-300 rounded-md"
                  aria-label="Ngày tạo"
                />
              </AdminFormField>
            </div>

            {/* Post Settings */}
            <div className="space-y-4">
              <AdminCheckbox
                name="published"
                checked={formData.published}
                onChange={handleChange}
                label="Xuất bản bài viết"
                helpText="Bài viết sẽ hiển thị công khai khi được xuất bản"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <AdminFormField label="Tiêu đề bài viết" required>
              <AdminInput
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề bài viết"
                required
              />
              {titleError && (
                <div className="mt-1 text-sm text-red-600">
                  {titleError}
                </div>
              )}
              {formData.title && !titleError && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">URL sẽ là:</span> 
                  <span className="ml-2 text-tech-blue font-mono">
                    /{generateSlug(formData.title)}
                  </span>
                </div>
              )}
            </AdminFormField>

            <AdminFormField label="Mô tả ngắn">
              <AdminTextarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Nhập mô tả ngắn về bài viết"
                rows={3}
              />
            </AdminFormField>

            <AdminFormField label="Nội dung bài viết" required>
              <TiptapEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Viết nội dung bài viết..."
                className="min-h-[400px]"
              />
            </AdminFormField>
          </div>

          <AdminFormField label="Chuyên mục" required>
            <AdminSelect
              name="category"
              value={formData.category}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  category: e.target.value,
                  subcategory: '' // Reset subcategory when category changes
                })
              }}
              options={CATEGORIES.map(cat => ({ value: cat.id, label: cat.name }))}
              placeholder="Chọn chuyên mục"
              required
            />
          </AdminFormField>

          {formData.category && (
            <AdminFormField label="Tiểu mục" required>
              <AdminSelect
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                options={CATEGORIES.find(cat => cat.id === formData.category)?.subcategories.map(sub => ({ 
                  value: sub.id, 
                  label: sub.name 
                })) || []}
                placeholder="Chọn tiểu mục"
                required
              />
            </AdminFormField>
          )}

          <AdminFormField label="Thẻ (Tags)">
            {loadingData ? (
              <div className="text-sm text-gray-500">Đang tải thẻ...</div>
            ) : (
              <AdminSelect
                name="selectedTags"
                value={formData.selectedTags[0] || ''}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    selectedTags: e.target.value ? [e.target.value] : []
                  })
                }}
                options={tags.map(tag => ({ 
                  value: tag.id, 
                  label: tag.name, 
                  color: tag.color 
                }))}
                placeholder="Chọn thẻ (tùy chọn)"
              />
            )}
          </AdminFormField>


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
                    title="Chọn hình ảnh từ thư viện"
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
                  title="Chọn file ảnh để tải lên"
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
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin/posts')}
            >
              Hủy
            </AdminButton>
            <AdminButton
              type="submit"
              loading={isSaving}
              disabled={isSaving}
            >
              Lưu thay đổi
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </AdminLayout>
  )
}
