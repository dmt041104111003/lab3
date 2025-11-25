'use client'

import { useState } from 'react'

const TAGS = [
  'Alchemy',
  'Announcements',
  'BSC',
  'DAOs',
  'DeFi',
  'Ethereum',
  'Flow',
  'NFTs',
  'Polygon',
  'Solana',
  'Solidity',
  'Testnets',
  'Tutorials',
  'Web3 Basics',
  'dApps',
]

export default function ArticleSearchBand() {
  const [search, setSearch] = useState('')

  return (
    <section className="w-full bg-[#F5F4F0] py-12 sm:py-16 text-gray-900 border-t border-[#E0DCCD]">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#4A2815]">Tìm kiếm bài viết</h2>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {TAGS.map((tag) => (
              <button
                key={tag}
                className="bg-white text-gray-800 rounded-lg py-2 text-sm font-semibold border border-[#E0DCCD] hover:bg-brand-light transition-colors"
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
          <form className="w-full lg:w-[420px]" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Nhập từ khóa bài viết..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white rounded-full px-4 py-3 border border-[#E0DCCD] text-sm text-gray-900 outline-none"
            />
          </form>
        </div>
      </div>
    </section>
  )
}

