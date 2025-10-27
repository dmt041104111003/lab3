interface TagBadgeProps {
  color?: string
  children: React.ReactNode
}

export default function TagBadge({ color = '#3B82F6', children }: TagBadgeProps) {
  const dynamicStyle = {
    backgroundColor: color,
  } as React.CSSProperties

  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
      style={dynamicStyle}
    >
      {children}
    </span>
  )
}
