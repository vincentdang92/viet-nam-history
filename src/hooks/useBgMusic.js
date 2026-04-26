'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export function useBgMusic() {
  const audioRef   = useRef(null)
  const startedRef = useRef(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('bgm_muted') === 'true'
    setMuted(saved)

    const audio = new Audio('/assets/nhac_nen_01.mp3')
    audio.loop   = true
    audio.volume = 0.35
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Start once — safe to call multiple times
  const start = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true
    const audio = audioRef.current
    if (!audio) return
    // Read current muted state from localStorage to avoid stale closure
    const isMuted = localStorage.getItem('bgm_muted') === 'true'
    if (!isMuted) audio.play().catch(() => {})
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    setMuted(prev => {
      const next = !prev
      localStorage.setItem('bgm_muted', String(next))
      if (next) {
        audio.pause()
      } else if (startedRef.current) {
        audio.play().catch(() => {})
      }
      return next
    })
  }, [])

  return { muted, start, toggle }
}
