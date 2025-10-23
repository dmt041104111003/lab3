'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import '../styles/tiptap.css'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import { useState, useEffect } from 'react'
import AdminModal from './admin/AdminModal'
import AdminInput from './admin/AdminInput'
import AdminButton from './admin/AdminButton'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function TiptapEditor({ content, onChange, placeholder = "Nhập nội dung bài viết...", className = "" }: TiptapEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showCaptionModal, setShowCaptionModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [imageCaption, setImageCaption] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg mx-auto block my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      CodeBlockLowlight.configure({
        lowlight: createLowlight(),
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-gray max-w-none focus:outline-none min-h-[300px] p-6 bg-white',
        style: 'line-height: 1.7; font-size: 16px; color: #374151;',
      },
    },
    immediatelyRender: false,
  })

  if (!isMounted || !editor) {
    return (
      <div className={`border border-gray-300 rounded-lg ${className}`}>
        <div className="border-b border-gray-200 p-2 bg-gray-50">
          <div className="text-sm text-gray-500">Đang tải editor...</div>
        </div>
        <div className="min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  const addImage = () => {
    setImageUrl('')
    setImageCaption('')
    setShowImageModal(true)
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.image.path)
      } else {
        alert('Lỗi khi upload ảnh')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Lỗi khi upload ảnh')
    } finally {
      setUploading(false)
    }
  }

  const addLink = () => {
    setLinkUrl('')
    setShowLinkModal(true)
  }

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      const imageHtml = imageCaption.trim() 
        ? `<figure class="image-container">
             <img src="${imageUrl.trim()}" alt="${imageCaption.trim()}" class="max-w-full h-auto rounded-lg mx-auto block my-4" />
             <figcaption class="image-caption text-center text-sm text-gray-600 italic mt-2">${imageCaption.trim()}</figcaption>
           </figure>`
        : `<img src="${imageUrl.trim()}" alt="" class="max-w-full h-auto rounded-lg mx-auto block my-4" />`
      
      editor.chain().focus().insertContent(imageHtml).run()
    }
    
    setShowImageModal(false)
    setImageUrl('')
    setImageCaption('')
  }

  const addImageCaption = () => {
    setImageCaption('')
    setShowCaptionModal(true)
  }

  const handleUpdateCaption = () => {
    if (imageCaption.trim()) {
      const captionHtml = `<div class="image-caption text-center text-sm text-gray-600 italic mt-2 mb-4">${imageCaption.trim()}</div>`
      editor.chain().focus().insertContent(captionHtml).run()
    }
    
    setShowCaptionModal(false)
    setImageCaption('')
  }

  const handleAddLink = () => {
    if (linkUrl.trim()) {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run()
      setShowLinkModal(false)
      setLinkUrl('')
    }
  }

  const getButtonClass = (isActive: boolean) => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-tech-blue text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-tech-blue/10 hover:text-tech-blue border border-gray-200'
    }`
  }

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2 bg-gradient-to-r from-gray-50 to-tech-blue/5">
        {/* Text formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getButtonClass(editor.isActive('bold'))}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getButtonClass(editor.isActive('italic'))}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={getButtonClass(editor.isActive('underline'))}
        >
          Underline
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={getButtonClass(editor.isActive('strike'))}
        >
          Strike
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={getButtonClass(editor.isActive('heading', { level: 1 }))}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={getButtonClass(editor.isActive('heading', { level: 2 }))}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={getButtonClass(editor.isActive('heading', { level: 3 }))}
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getButtonClass(editor.isActive('bulletList'))}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={getButtonClass(editor.isActive('orderedList'))}
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Media */}
        <button
          onClick={addImage}
          className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-tech-blue/10 hover:text-tech-blue border border-gray-200 transition-colors"
        >
          Image
        </button>
        <button
          onClick={addImageCaption}
          className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-tech-blue/10 hover:text-tech-blue border border-gray-200 transition-colors"
        >
          Add Caption
        </button>
        <button
          onClick={addLink}
          className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-tech-blue/10 hover:text-tech-blue border border-gray-200 transition-colors"
        >
          Link
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Code */}
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={getButtonClass(editor.isActive('code'))}
        >
          Code
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={getButtonClass(editor.isActive('codeBlock'))}
        >
          Code Block
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={getButtonClass(editor.isActive({ textAlign: 'left' }))}
        >
          Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-tech-blue text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-tech-blue/10 hover:text-tech-blue border border-gray-200'
          }`}
        >
          Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-tech-blue text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-tech-blue/10 hover:text-tech-blue border border-gray-200'
          }`}
        >
          Right
        </button>

      </div>

      {/* Editor content */}
      <div className="min-h-[300px]">
        <EditorContent editor={editor} />
      </div>

      {/* Image Modal */}
      <AdminModal
        isOpen={showImageModal}
        title="Thêm ảnh"
        onClose={() => {
          setShowImageModal(false)
          setImageUrl('')
          setImageCaption('')
        }}
        size="md"
      >
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload ảnh
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tech-blue file:text-white hover:file:bg-tech-blue/90"
              disabled={uploading}
            />
            {uploading && (
              <div className="text-sm text-gray-500 mt-1">Đang upload...</div>
            )}
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hoặc nhập URL ảnh
            </label>
            <AdminInput
              name="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Nhập URL ảnh..."
            />
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chú thích ảnh (tùy chọn)
            </label>
            <AdminInput
              name="imageCaption"
              type="text"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              placeholder="Nhập chú thích cho ảnh..."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setShowImageModal(false)
                setImageUrl('')
                setImageCaption('')
              }}
            >
              Hủy
            </AdminButton>
            <AdminButton
              type="button"
              onClick={handleAddImage}
              disabled={!imageUrl.trim() || uploading}
            >
              {uploading ? 'Đang upload...' : 'Thêm ảnh'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Caption Modal */}
      <AdminModal
        isOpen={showCaptionModal}
        title="Thêm chú thích dưới ảnh"
        onClose={() => {
          setShowCaptionModal(false)
          setImageCaption('')
        }}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chú thích ảnh
            </label>
            <AdminInput
              name="imageCaption"
              type="text"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              placeholder="Nhập chú thích cho ảnh..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Chú thích sẽ được thêm vào vị trí con trỏ hiện tại
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setShowCaptionModal(false)
                setImageCaption('')
              }}
            >
              Hủy
            </AdminButton>
            <AdminButton
              type="button"
              onClick={handleUpdateCaption}
              disabled={!imageCaption.trim()}
            >
              Thêm chú thích
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Link Modal */}
      <AdminModal
        isOpen={showLinkModal}
        title="Thêm liên kết"
        onClose={() => setShowLinkModal(false)}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL liên kết
            </label>
            <AdminInput
              name="linkUrl"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Nhập URL liên kết..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => setShowLinkModal(false)}
            >
              Hủy
            </AdminButton>
            <AdminButton
              type="button"
              onClick={handleAddLink}
              disabled={!linkUrl.trim()}
            >
              Thêm liên kết
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  )
}
