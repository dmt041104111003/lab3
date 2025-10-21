interface SectionBannerProps {
  title: string
  className?: string
}

export default function SectionBanner({ title, className = "" }: SectionBannerProps) {
  return (
    <div className={`section-banner px-6 py-4 text-center ${className}`}>
      <h2 className="text-xl font-bold uppercase tracking-wide">
        {title}
      </h2>
    </div>
  )
}
