'use client'

import { useEffect, useState } from 'react'
import { RiCloseLine, RiErrorWarningLine, RiCheckboxCircleLine, RiInformationLine } from 'react-icons/ri'

export type ToastType = 'error' | 'success' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    error: RiErrorWarningLine,
    success: RiCheckboxCircleLine,
    info: RiInformationLine,
    warning: RiErrorWarningLine,
  }

  const Icon = icons[type]

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''}`} role="alert">
      <Icon className="toast-icon" />
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        aria-label="Close notification"
      >
        <RiCloseLine />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: ToastType }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}

