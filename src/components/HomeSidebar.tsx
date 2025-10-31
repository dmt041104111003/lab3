import Link from 'next/link'

interface Post {
  id: string
  title: string
  slug: string
  subcategory?: string
}

interface SidebarSectionProps {
  title: string
  items: Array<{
    title: string
    href: string
  }>
  subcategoryLinks?: Array<{
    title: string
    href: string
  }>
}

function SidebarSection({ title, items, subcategoryLinks }: SidebarSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
        {title}
      </h3>
      {subcategoryLinks && subcategoryLinks.length > 0 && (
        <div className="space-y-2 mb-4">
          {subcategoryLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="block text-gray-700 text-xs hover:text-red-600 transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="text-gray-600 text-xs">
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

interface HomeSidebarProps {
  quickNews?: Post[]
  techToday?: Post[]
  mostRead?: Post[]
  innovationPosts?: Post[]
  productPosts?: Post[]
  trendPosts?: Post[]
  latestNews?: Post[]
  nhanVatPosts?: Post[]
  multimediaPosts?: Post[]
  banDocPosts?: Post[]
}

export default function HomeSidebar({ 
  quickNews = [], 
  techToday = [], 
  mostRead = [],
  innovationPosts = [],
  productPosts = [],
  trendPosts = [],
  latestNews = [],
  nhanVatPosts = [],
  multimediaPosts = [],
  banDocPosts = []
}: HomeSidebarProps) {
  const mostReadItems = mostRead.length > 0 ? mostRead.slice(0, 5).map(post => ({
    title: post.title,
    href: `/tin-tuc/${post.subcategory || 'cong-nghe-viet-nam'}/${post.slug}`
  })) : []

  const quickNewsItems = quickNews.length > 0 ? quickNews.slice(0, 5).map(post => ({
    title: post.title,
    href: `/xu-huong-tuong-lai/${post.subcategory || 'blockchain'}/${post.slug}`
  })) : []

  const techTodayItems = techToday.length > 0 ? techToday.map(post => ({
    title: post.title,
    href: `/ai-chuyen-doi-so/${post.subcategory || 'tri-tue-nhan-tao'}/${post.slug}`
  })) : []

  const innovationItems = innovationPosts.length > 0 ? innovationPosts.map(post => ({
    title: post.title,
    href: `/doi-moi-sang-tao/${post.subcategory || 'startup-viet'}/${post.slug}`
  })) : []

  const productItems = productPosts.length > 0 ? productPosts.map(post => ({
    title: post.title,
    href: `/san-pham-review/${post.subcategory || 'thiet-bi-moi'}/${post.slug}`
  })) : []

  const trendItems = trendPosts.length > 0 ? trendPosts.map(post => ({
    title: post.title,
    href: `/xu-huong-tuong-lai/${post.subcategory || 'blockchain'}/${post.slug}`
  })) : []

  const latestItems = latestNews.length > 0 ? latestNews.map(post => ({
    title: post.title,
    href: `/tin-tuc/${post.subcategory || 'cong-nghe-viet-nam'}/${post.slug}`
  })) : []

  const nhanVatItems = nhanVatPosts.length > 0 ? nhanVatPosts.slice(0, 5).map(post => ({
    title: post.title,
    href: `/nhan-vat-goc-nhin/${post.subcategory || 'chan-dung-nha-sang-tao'}/${post.slug}`
  })) : []

  const multimediaItems = multimediaPosts.length > 0 ? multimediaPosts.slice(0, 5).map(post => ({
    title: post.title,
    href: `/multimedia/${post.subcategory || 'video'}/${post.slug}`
  })) : []

  const banDocItems = banDocPosts.length > 0 ? banDocPosts.slice(0, 5).map(post => ({
    title: post.title,
    href: `/ban-doc/${post.slug}`
  })) : []

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <SidebarSection title="ĐỌC NHIỀU NHẤT" items={mostReadItems} />
      <SidebarSection title="TIN NHANH" items={quickNewsItems} />
      <SidebarSection 
        title="NHÂN VẬT & GÓC NHÌN" 
        items={nhanVatItems}
      />
      <SidebarSection 
        title="MULTIMEDIA" 
        items={multimediaItems}
      />
      <SidebarSection title="BẠN ĐỌC" items={banDocItems} />
    </aside>
  )
}
