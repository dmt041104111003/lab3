import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/gioi-thieu" className="text-gray-300 hover:text-white transition-colors">
              Giới thiệu
            </Link>
            <Link href="/lien-he" className="text-gray-300 hover:text-white transition-colors">
              Liên hệ
            </Link>
            <Link href="/chinh-sach-bao-mat" className="text-gray-300 hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
          <div className="text-gray-300 text-sm">
            TechNova - Công nghệ & Đời sống © 2025
          </div>
        </div>
      </div>
    </footer>
  )
}
