'use client'

import { useState, useCallback } from 'react'
import type { ToastType } from '@/components/toast'

interface Toast {
  id: string
  message: string
  type?: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showError = useCallback((message: string) => showToast(message, 'error'), [showToast])
  const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast])
  const showInfo = useCallback((message: string) => showToast(message, 'info'), [showToast])
  const showWarning = useCallback((message: string) => showToast(message, 'warning'), [showToast])

  return {
    toasts,
    showToast,
    showError,
    showSuccess,
    showInfo,
    showWarning,
    removeToast,
  }
}

