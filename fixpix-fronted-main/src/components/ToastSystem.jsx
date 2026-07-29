import React, { useState, useEffect } from 'react'
import useToastStore from '../store/toastStore'

const TOAST_ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
  loading: null // spinner
}

const TOAST_COLORS = {
  success: {
    bg: 'rgba(16,185,129,0.95)',
    border: 'rgba(16,185,129,0.3)',
    icon_bg: 'rgba(255,255,255,0.2)'
  },
  error: {
    bg: 'rgba(239,68,68,0.95)',
    border: 'rgba(239,68,68,0.3)',
    icon_bg: 'rgba(255,255,255,0.2)'
  },
  info: {
    bg: 'rgba(37,99,235,0.95)',
    border: 'rgba(37,99,235,0.3)',
    icon_bg: 'rgba(255,255,255,0.2)'
  },
  warning: {
    bg: 'rgba(245,158,11,0.95)',
    border: 'rgba(245,158,11,0.3)',
    icon_bg: 'rgba(255,255,255,0.2)'
  },
  loading: {
    bg: 'rgba(30,30,30,0.95)',
    border: 'rgba(255,255,255,0.1)',
    icon_bg: 'transparent'
  }
}

function Toast({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  
  useEffect(() => {
    // Enter animation
    requestAnimationFrame(() => setVisible(true))
    
    // Exit animation before remove
    const exitTimer = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration - 300)
    
    return () => clearTimeout(exitTimer)
  }, [onRemove, toast.duration, toast.id])
  
  const colors = TOAST_COLORS[toast.type]
  
  return (
    <div
      className={`toast ${visible ? 'visible' : ''} ${leaving ? 'leaving' : ''}`}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
      onClick={() => onRemove(toast.id)}
    >
      {/* Icon */}
      <div className="toast-icon" style={{ background: colors.icon_bg }}>
        {toast.type === 'loading' ? (
          <div className="toast-spinner" />
        ) : (
          <span>{TOAST_ICONS[toast.type]}</span>
        )}
      </div>
      
      {/* Message */}
      <span className="toast-message">{toast.message}</span>
      
      {/* Progress bar */}
      {toast.type !== 'loading' && (
        <div 
          className="toast-progress"
          style={{ animationDuration: `${toast.duration}ms` }}
        />
      )}
    </div>
  )
}

export function ToastSystem() {
  const { toasts, remove } = useToastStore()
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={remove} />
      ))}
    </div>
  )
}
