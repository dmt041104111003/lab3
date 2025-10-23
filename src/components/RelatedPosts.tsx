'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string
  createdAt: string
  author: {
    id: string
    name: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
    color: string
  }>
  image: {
    id: string
    filename: string
    alt: string
  } | null
}

interface RelatedPostsProps {
  currentPostSlug: string
  className?: string
}

// Simple image component with fallback
const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  if (imageError || !src) {
    return (
      <div className={`bg-gradient-to-br from-tech-blue/20 to-tech-blue/40 flex items-center justify-center ${className}`}>
        <svg className="w-6 h-6 text-tech-blue" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }

  return (
    <div className="relative">
      {!imageLoaded && (
        <div className={`absolute inset-0 bg-gradient-to-br from-tech-blue/20 to-tech-blue/40 flex items-center justify-center ${className}`}>
          <svg className="w-6 h-6 text-tech-blue" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  )
}

export default function RelatedPosts({ currentPostSlug, className = '' }: RelatedPostsProps) {
  const [posts, setPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch(`/api/posts/related?excludeSlug=${currentPostSlug}&limit=3`)
        const data = await response.json()
        
        if (response.ok) {
          setPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Error fetching related posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedPosts()
  }, [currentPostSlug])

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Bài viết liên quan</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Bài viết mới nhất</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/bai-viet/${post.slug}`}
            className="flex gap-4 hover:bg-gray-50 p-3 rounded-lg transition-colors group"
          >
            {/* Thumbnail */}
            <div className="w-28 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <ImageWithFallback
                src={post.image && post.image.path 
                  ? (post.image.path.startsWith('http') 
                      ? post.image.path 
                      : `https://res.cloudinary.com/demo/image/fetch/w_112,h_80,c_fill,g_auto/${post.image.path}`)
                  : ''
                }
                alt={post.image?.alt || post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-tech-blue transition-colors mb-1">
                {post.title}
              </h4>
              {post.excerpt && (
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center text-xs text-gray-500">
                <span className="font-medium">{post.author.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                {post.tags.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: post.tags[0].color + '20',
                        color: post.tags[0].color 
                      }}
                    >
                      {post.tags[0].name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
