"use client";

import { useState } from 'react';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function TruncatedText({ text, maxLength = 100, className = "" }: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded ? text : text.slice(0, maxLength) + (shouldTruncate ? '...' : '');
  
  if (!shouldTruncate) {
    return <span className={className}>{text}</span>;
  }
  
  return (
    <div className={className}>
      <span>{displayText}</span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-1 text-tech-blue hover:text-brand-dark text-sm font-medium underline"
      >
        {isExpanded ? 'Hide' : 'Show more'}
      </button>
    </div>
  );
} 