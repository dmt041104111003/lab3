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
import TiptapPreview from './TiptapPreview'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function TiptapEditor({ content, onChange, placeholder = "Nhập nội dung bài viết...", className = "" }: TiptapEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

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
    const url = window.prompt('Nhập URL ảnh:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('Nhập URL liên kết:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
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

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Preview toggle */}
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            isPreview ? 'bg-tech-dark-blue text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-tech-blue/10 hover:text-tech-blue border border-gray-200'
          }`}
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor content */}
      <div className="min-h-[300px]">
        {isPreview ? (
          <TiptapPreview 
            content={editor.getHTML()} 
            className="min-h-[300px]"
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  )
}
