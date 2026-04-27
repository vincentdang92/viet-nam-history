'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { signInAnonymously, GoogleAuthProvider, linkWithPopup, onAuthStateChanged } from 'firebase/auth'
import { getFirebaseAuth } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playerName, setPlayerNameState] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('minh_chu_player_name')
    if (saved) setPlayerNameState(saved)

    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u)
        setLoading(false)
      } else {
        try {
          const result = await signInAnonymously(auth)
          setUser(result.user)
        } catch {}
        setLoading(false)
      }
    })

    return () => unsub()
  }, [])

  const setPlayerName = (name) => {
    localStorage.setItem('minh_chu_player_name', name)
    setPlayerNameState(name)
  }

  const linkGoogle = async () => {
    const auth = getFirebaseAuth()
    if (!auth || !user) return { error: 'not_ready' }
    try {
      const provider = new GoogleAuthProvider()
      const result = await linkWithPopup(user, provider)
      setUser(result.user)
      return { success: true, email: result.user.email }
    } catch (err) {
      return { error: err.code }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      playerName,
      setPlayerName,
      linkGoogle,
      isLinked: !!(user && !user.isAnonymous),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
