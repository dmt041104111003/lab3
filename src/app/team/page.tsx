'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const teamMembers = [
  {
    name: 'Dao Manh Tung',
    avatar: '/daomanhtung.jpg',
    role: 'Full-Stack Blockchain & AI Engineer',
    bio: [
      'University of Transport and Communications',
      'Full-stack & Blockchain Developer',
      '1st Place – Scientific Research Competition: AI system for comment domain classification.',
      '2nd Place – Student Track, Cardano Hackathon 2025',
      '3rd Place – Scientific Research Competition: Decentralized LMS with Blockchain-based Certificates on Cardano',
      '3rd Place – Hackathon Contest - Summer Code Camp Data & AI',
      'Experience in developing DApps and writing smart contracts using Aiken and Move',
    ],
    contact: [
      { label: 'Email', value: 'daomanhtung4102003@gmail.com', href: 'mailto:daomanhtung4102003@gmail.com' },
      { label: 'GitHub', value: 'github.com/dmt041104111003', href: 'https://github.com/dmt041104111003' },
      { label: 'Telegram', value: '@daomanhtung041104', href: 'https://t.me/daomanhtung041104' },
      { label: 'Facebook', value: 'facebook.com/daomanhtung111003', href: 'https://www.facebook.com/daomanhtung111003' },
    ],
  },
  {
    name: 'Phan Dinh Nghia',
    avatar: '/phandinhnghia.jpg',
    role: 'Full-stack Developer & Assistant Lecturer',
    bio: [
      'University of Transport and Communications',
      'Full-stack & Blockchain Developer',
      '2nd Place – Student Track, Cardano Hackathon 2025',
      '3rd Place – Scientific Research Competition: Decentralized LMS with Blockchain-based Certificates on Cardano',
      'Experienced with Aiken (Cardano) and Move (Aptos)',
    ],
    contact: [
      { label: 'Email', value: 'nghiaphan04dev@gmail.com', href: 'mailto:nghiaphan04dev@gmail.com' },
      { label: 'GitHub', value: 'github.com/nghiaphan04', href: 'https://github.com/nghiaphan04' },
      { label: 'Telegram', value: '@nghia0415', href: 'https://t.me/nghia0415' },
      { label: 'Facebook', value: 'facebook.com/dinhnghia.phan.524', href: 'https://www.facebook.com/dinhnghia.phan.524?locale=vi_VN' },
    ],
  },
]

export default function TeamPage() {
  useEffect(() => {
    document.title = 'Team - LAB3'
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <p className="text-sm text-gray-600 uppercase tracking-[0.3em]">LAB3</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Project Team</h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-3xl mx-auto">
            Nhóm phát triển LAB3 – tập trung nghiên cứu công nghệ blockchain và xây dựng các giải pháp DApp cho giáo dục số.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border-b border-gray-100">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow"
                />
                <div className="text-center sm:text-left">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">LAB3 TEAM</p>
                  <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
                  <p className="text-brand-dark text-sm font-semibold mt-1">{member.role}</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Bio</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {member.bio.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-accent mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Contact</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {member.contact.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-gray-500 w-16">{item.label}:</span>
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-tech-blue hover:text-tech-dark-blue break-all">
                          {item.value}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
