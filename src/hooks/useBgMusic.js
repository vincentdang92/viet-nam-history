'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

let globalAudio = null
let globalStarted = false
const subscribers = new Set()

function notifySubscribers(isMuted) {
  subscribers.forEach(cb => cb(isMuted))
}

export function useBgMusic() {
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('bgm_muted') === 'true'
    setMuted(saved)

    if (typeof window !== 'undefined' && !globalAudio) {
      globalAudio = new Audio('/assets/nhac_nen_01.mp3')
      globalAudio.loop = true
      globalAudio.volume = 0.35
    }

    const handleChange = (newMuted) => setMuted(newMuted)
    subscribers.add(handleChange)

    return () => {
      subscribers.delete(handleChange)
    }
  }, [])

  const start = useCallback(() => {
    if (globalStarted || !globalAudio) return
    globalStarted = true
    const isMuted = localStorage.getItem('bgm_muted') === 'true'
    if (!isMuted) globalAudio.play().catch(() => {})
  }, [])

  const toggle = useCallback(() => {
    if (!globalAudio) return
    const next = !(localStorage.getItem('bgm_muted') === 'true')
    localStorage.setItem('bgm_muted', String(next))
    
    if (next) {
      globalAudio.pause()
    } else {
      globalStarted = true
      globalAudio.play().catch(() => {})
    }
    
    notifySubscribers(next)
  }, [])

  return { muted, start, toggle }
}
