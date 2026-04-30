'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { signInAnonymously, GoogleAuthProvider, linkWithPopup, onAuthStateChanged, signOut, signInWithCredential, updateEmail, updatePassword, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirebaseAuth } from '../lib/firebase'
import { saveUserProfile, loadUserProfile } from '../lib/firestore'

const AuthContext = createContext(null)

const DEFAULT_PROFILE = {
  playerName: null,
  nameChangeCount: 0,
  unlockedSuKy: [],
  milestones: []
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfileState] = useState(DEFAULT_PROFILE)
  const profileTimerRef = useRef(null)

  useEffect(() => {
    // Load from local storage
    const rawProfile = localStorage.getItem('minh_chu_profile')
    if (rawProfile) {
      try {
        setProfileState(JSON.parse(rawProfile))
      } catch {}
    } else {
      // Migrate old data
      const oldName = localStorage.getItem('minh_chu_player_name')
      if (oldName) {
        setProfileState(p => ({ ...p, playerName: oldName }))
      }
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u)
        
        // Fetch firestore profile when logged in (even anonymously)
        const remoteProfile = await loadUserProfile(u.uid)
        if (remoteProfile) {
          setProfileState(prev => {
            const merged = { ...prev }
            if (remoteProfile.playerName) merged.playerName = remoteProfile.playerName
            if (remoteProfile.nameChangeCount !== undefined) merged.nameChangeCount = Math.max(prev.nameChangeCount, remoteProfile.nameChangeCount)
            
            // Merge arrays (unique items only)
            merged.unlockedSuKy = [...new Set([...prev.unlockedSuKy, ...(remoteProfile.unlockedSuKy || [])])]
            merged.milestones = [...new Set([...prev.milestones, ...(remoteProfile.milestones || [])])]
            
            localStorage.setItem('minh_chu_profile', JSON.stringify(merged))
            return merged
          })
        }
        
        setLoading(false)
      } else {
        try {
          const result = await signInAnonymously(auth)
          setUser(result.user)
        } catch (err) {
          // ADMIN_ONLY_OPERATION = Anonymous auth not enabled in Firebase Console
          // Game still works via localStorage — just no Firestore sync
          console.warn('[Auth] signInAnonymously failed:', err.code)
        }
        setLoading(false)
      }
    })

    return () => {
      unsub()
      if (profileTimerRef.current) clearTimeout(profileTimerRef.current)
    }
  }, [])

  const updateProfile = (updates) => {
    setProfileState(prev => {
      const merged = { ...prev, ...updates }
      
      // Specialized merge for arrays
      if (updates.unlockedSuKy) {
        merged.unlockedSuKy = [...new Set([...prev.unlockedSuKy, ...updates.unlockedSuKy])]
      }
      if (updates.milestones) {
        merged.milestones = [...new Set([...prev.milestones, ...updates.milestones])]
      }
      
      localStorage.setItem('minh_chu_profile', JSON.stringify(merged))

      // Sync to firestore debounced
      if (user?.uid) {
        if (profileTimerRef.current) clearTimeout(profileTimerRef.current)
        profileTimerRef.current = setTimeout(() => {
          saveUserProfile(user.uid, merged)
        }, 1500)
      }
      
      return merged
    })
  }

  const setPlayerName = (name) => {
    if (name === null || name === 'Ẩn Danh') {
      // Clear name or ẩn danh không tăng bộ đếm
      updateProfile({ playerName: name })
    } else {
      updateProfile({ 
        playerName: name,
        nameChangeCount: profile.nameChangeCount + 1
      })
    }
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
      if (err.code === 'auth/credential-already-in-use') {
        try {
          const credential = GoogleAuthProvider.credentialFromError(err)
          const signInResult = await signInWithCredential(auth, credential)
          setUser(signInResult.user)
          return { success: true, email: signInResult.user.email, isExistingAccount: true }
        } catch (signInErr) {
          console.error("signInWithCredential error:", signInErr)
          return { error: signInErr.code }
        }
      }
      return { error: err.code }
    }
  }

  const signUpEmail = async (email, password) => {
    const auth = getFirebaseAuth()
    if (!auth || !user) return { error: 'not_ready' }
    try {
      await updateEmail(user, email)
      await updatePassword(user, password)
      return { success: true, email }
    } catch (err) {
      return { error: err.code }
    }
  }

  const loginEmail = async (email, password) => {
    const auth = getFirebaseAuth()
    if (!auth) return { error: 'not_ready' }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      setUser(result.user)
      return { success: true, email: result.user.email, isExistingAccount: true }
    } catch (err) {
      return { error: err.code }
    }
  }

  const logout = async () => {
    const auth = getFirebaseAuth()
    if (!auth) return
    try {
      await signOut(auth)
      // Xóa dữ liệu local khi đăng xuất để bắt đầu phiên ẩn danh mới sạch sẽ
      localStorage.removeItem('minh_chu_profile')
      localStorage.removeItem('minh_chu_save')
      localStorage.removeItem('minh_chu_player_name')
      setProfileState(DEFAULT_PROFILE)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      profile,
      playerName: profile.playerName,
      setPlayerName,
      updateProfile,
      linkGoogle,
      signUpEmail,
      loginEmail,
      logout,
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
