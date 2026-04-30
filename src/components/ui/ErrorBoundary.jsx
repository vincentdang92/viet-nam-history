'use client'

import React from 'react'
import { logCrashToFirestore } from '../../utils/firebase'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lỗi nghiêm trọng (Crash):', error, errorInfo)
    // Send crash report to Firestore if initialized
    logCrashToFirestore(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A0F0A] text-[#F5E6D0] p-6 text-center">
          <div className="text-6xl mb-6">🌩️</div>
          <h1 className="text-3xl font-bold text-[#FF4444] mb-4">Trời giáng sấm sét!</h1>
          <p className="mb-8 max-w-md text-[#A08070] leading-relaxed">
            Dòng thời gian đã bị đứt gãy do một lỗi không xác định. Lỗi này đã được ghi nhận vào mật thư (Firebase) để đội ngũ phát triển khắc phục.
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#8B1A1A] hover:bg-[#A02020] rounded-xl font-bold transition-colors"
          >
            Quay lại dòng thời gian (Tải lại trang)
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded text-left overflow-auto max-w-2xl w-full">
              <p className="font-mono text-xs text-red-300 whitespace-pre-wrap">
                {this.state.error?.toString()}
              </p>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
