'use client'

import { useEffect, useState } from 'react'

export interface ProposalPost {
  id: string
  title: string
  excerpt: string
  slug: string
  createdAt: string
  authorName?: string
  images?: Array<{
    image: {
      id: string
      path: string
      alt?: string
    }
  }>
  tags?: Array<{
    id: string
    name: string
  }>
}

const containsFundingKeyword = (value?: string) => {
  if (!value) return false
  const keywords = ['được cấp vốn', 'funded', 'grant', 'tài trợ', 'cấp vốn']
  const lower = value.toLowerCase()
  return keywords.some((keyword) => lower.includes(keyword))
}

const isFundedProject = (post: ProposalPost) => {
  if (post.tags && post.tags.some((tag) => containsFundingKeyword(tag.name))) {
    return true
  }
  return containsFundingKeyword(post.title) || containsFundingKeyword(post.excerpt)
}

export function useProposalData() {
  const [posts, setPosts] = useState<ProposalPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProposalPosts = async () => {
      try {
        const response = await fetch('/api/posts/category/proposal')
        if (!response.ok) {
          setError('Không thể tải bài viết proposal')
          return
        }
        const data = await response.json()
        const list = Array.isArray(data) ? data : Array.isArray(data?.posts) ? data.posts : []
        setPosts(list)
      } catch (err) {
        setError('Không thể tải bài viết proposal')
      } finally {
        setLoading(false)
      }
    }

    fetchProposalPosts()
    document.title = 'Proposal - LAB3'
  }, [])

  const fundedProjects = posts.filter(isFundedProject)
  const submittedProjects = posts.filter((post) => !isFundedProject(post))
  const featuredPost = posts[0] || null

  return {
    posts,
    loading,
    error,
    featuredPost,
    fundedProjects,
    submittedProjects,
  }
}



