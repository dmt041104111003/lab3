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
}

function SidebarSection({ title, items }: SidebarSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
        {title}
      </h3>
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
}

export default function HomeSidebar({ 
  quickNews = [], 
  techToday = [], 
  mostRead = [],
  innovationPosts = [],
  productPosts = [],
  trendPosts = [],
  latestNews = []
}: HomeSidebarProps) {
  const mostReadItems = mostRead.length > 0 ? mostRead.slice(0, 4).map(post => ({
    title: post.title,
    href: `/tin-tuc/${post.subcategory || 'cong-nghe-viet-nam'}/${post.slug}`
  })) : [
    { title: "Bài viết sắp ra mắt", href: "#" },
    { title: "Bài viết sắp ra mắt", href: "#" },
    { title: "Bài viết sắp ra mắt", href: "#" },
    { title: "Bài viết sắp ra mắt", href: "#" }
  ]

  const quickNewsItems = quickNews.length > 0 ? quickNews.slice(0, 3).map(post => ({
    title: post.title,
    href: `/xu-huong-tuong-lai/${post.subcategory || 'blockchain'}/${post.slug}`
  })) : [
    { title: "Tin nhanh sắp ra mắt", href: "#" },
    { title: "Tin nhanh sắp ra mắt", href: "#" },
    { title: "Tin nhanh sắp ra mắt", href: "#" }
  ]

  const techTodayItems = techToday.length > 0 ? techToday.slice(0, 2).map(post => ({
    title: post.title,
    href: `/ai-chuyen-doi-so/${post.subcategory || 'tri-tue-nhan-tao'}/${post.slug}`
  })) : [
    { title: "Công nghệ sắp ra mắt", href: "#" },
    { title: "Công nghệ sắp ra mắt", href: "#" }
  ]

  const innovationItems = innovationPosts.length > 0 ? innovationPosts.slice(0, 3).map(post => ({
    title: post.title,
    href: `/doi-moi-sang-tao/${post.subcategory || 'startup-viet'}/${post.slug}`
  })) : [
    { title: "Đổi mới sáng tạo sắp ra mắt", href: "#" },
    { title: "Đổi mới sáng tạo sắp ra mắt", href: "#" },
    { title: "Đổi mới sáng tạo sắp ra mắt", href: "#" }
  ]

  const productItems = productPosts.length > 0 ? productPosts.slice(0, 3).map(post => ({
    title: post.title,
    href: `/san-pham-review/${post.subcategory || 'thiet-bi-moi'}/${post.slug}`
  })) : [
    { title: "Sản phẩm & Review sắp ra mắt", href: "#" },
    { title: "Sản phẩm & Review sắp ra mắt", href: "#" },
    { title: "Sản phẩm & Review sắp ra mắt", href: "#" }
  ]

  const trendItems = trendPosts.length > 0 ? trendPosts.slice(0, 3).map(post => ({
    title: post.title,
    href: `/xu-huong-tuong-lai/${post.subcategory || 'blockchain'}/${post.slug}`
  })) : [
    { title: "Xu hướng sắp ra mắt", href: "#" },
    { title: "Xu hướng sắp ra mắt", href: "#" },
    { title: "Xu hướng sắp ra mắt", href: "#" }
  ]

  const latestItems = latestNews.length > 0 ? latestNews.slice(0, 3).map(post => ({
    title: post.title,
    href: `/tin-tuc/${post.subcategory || 'cong-nghe-viet-nam'}/${post.slug}`
  })) : [
    { title: "Tin mới nhất sắp ra mắt", href: "#" },
    { title: "Tin mới nhất sắp ra mắt", href: "#" },
    { title: "Tin mới nhất sắp ra mắt", href: "#" }
  ]

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <SidebarSection title="ĐỌC NHIỀU NHẤT" items={mostReadItems} />
      <SidebarSection title="TIN NHANH" items={quickNewsItems} />
      <SidebarSection title="CÔNG NGHỆ HÔM NAY" items={techTodayItems} />
      <SidebarSection title="TIN MỚI NHẤT" items={latestItems} />
      <SidebarSection title="ĐỔI MỚI SÁNG TẠO" items={innovationItems} />
      <SidebarSection title="SẢN PHẨM & REVIEW" items={productItems} />
      <SidebarSection title="XU HƯỚNG TƯƠNG LAI" items={trendItems} />
    </aside>
  )
}
