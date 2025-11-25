"use client";

import { TruncatedText } from './truncated-text';
import AdminModal from '@/components/admin/AdminModal';

interface TooltipPopupProps {
  isOpen: boolean;
  selectedText: string;
  tooltipText: string;
  onTooltipTextChange: (text: string) => void;
  onAddTooltip: () => void;
  onRemoveTooltip: () => void;
  onClose: () => void;
}

export function TooltipPopup({
  isOpen,
  selectedText,
  tooltipText,
  onTooltipTextChange,
  onAddTooltip,
  onRemoveTooltip,
  onClose
}: TooltipPopupProps) {
  if (!isOpen) return null;

  return (
      <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Tooltip"
    >
      <div className="space-y-4">
        {selectedText && (
          <div className="p-3 bg-brand-light rounded-lg border border-brand-muted">
            <p className="text-sm text-tech-blue font-medium mb-2">Selected Text:</p>
            <TruncatedText 
              text={selectedText} 
              maxLength={100}
              className="text-sm text-brand-deep break-words"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tooltip Content
          </label>
          <textarea
            value={tooltipText}
            onChange={(e) => onTooltipTextChange(e.target.value)}
            placeholder="Enter tooltip content for the selected text..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-tech-blue resize-none"
            rows={4}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onAddTooltip}
            disabled={!tooltipText.trim()}
            className="flex-1 px-4 py-2 bg-tech-blue text-white rounded-md hover:bg-tech-dark-blue disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Add Tooltip
          </button>
          <button
            type="button"
            onClick={onRemoveTooltip}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium transition-colors"
          >
            Remove Tooltip
          </button>
        </div>
      </div>
      </AdminModal>
  );
} 