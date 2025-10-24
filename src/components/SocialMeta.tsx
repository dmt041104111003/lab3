'use client'

import Head from 'next/head'

interface SocialMetaProps {
  title: string
  description?: string
  image?: string
  url?: string
  type?: 'article' | 'website'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export default function SocialMeta({
  title,
  description,
  image,
  url,
  type = 'article',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}: SocialMetaProps) {
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  
  const getFullImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return '/footer.png'
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`
  }
  
  const fullImage = getFullImageUrl(image)
  const fullDescription = description || 'Đọc bài viết trên TechNova - Nền tảng tin tức công nghệ hàng đầu Việt Nam'

  return (
    <Head>
      <title>{title} - TechNova</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={tags.join(', ')} />
      
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="TechNova" />
      <meta property="og:locale" content="vi_VN" />
      
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@technova" />
      <meta name="twitter:creator" content="@technova" />
      
      <meta name="robots" content="index, follow" />
      <meta name="author" content={author || "TechNova"} />
      <link rel="canonical" href={fullUrl} />
    </Head>
  )
}
