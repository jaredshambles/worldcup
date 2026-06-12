'use client'

import React, { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Return null if modal is not open
  if (!isOpen) {
    return null
  }

  // Handle backdrop click to close modal
  const handleBackdropClick = () => {
    onClose()
  }

  // Prevent modal content click from closing modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center"
        onClick={handleBackdropClick}
      >
        {/* Modal content */}
        <div
          className="w-full md:max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
          onClick={handleContentClick}
          role="dialog"
          aria-modal="true"
        >
          {/* Header with title (if provided) */}
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
          )}

          {/* Content area */}
          <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  )
}
