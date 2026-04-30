import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { getFirestoreDB } from './firebase'

const SESSION_DOC = 'current'

function sessionRef(uid) {
  const db = getFirestoreDB()
  if (!db || !uid) return null
  return doc(db, 'users', uid, 'sessions', SESSION_DOC)
}

function profileRef(uid) {
  const db = getFirestoreDB()
  if (!db || !uid) return null
  return doc(db, 'users', uid, 'profile', 'data')
}

// Strip undefined values so Firestore doesn't reject the document
function sanitize(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export async function saveGameState(uid, gameState) {
  const ref = sessionRef(uid)
  if (!ref) return false
  try {
    await setDoc(ref, {
      gameState: sanitize(gameState),
      savedAt: Date.now(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
    })
    return true
  } catch {
    return false
  }
}

export async function loadGameState(uid) {
  const ref = sessionRef(uid)
  if (!ref) return null
  try {
    const snap = await getDoc(ref)
    if (snap.exists()) return snap.data().gameState ?? null
  } catch {}
  return null
}

export async function clearGameState(uid) {
  const ref = sessionRef(uid)
  if (!ref) return
  try {
    await setDoc(ref, { gameState: null, savedAt: Date.now() })
  } catch {}
}

export async function saveUserProfile(uid, profileData) {
  const ref = profileRef(uid)
  if (!ref) return false
  try {
    await setDoc(ref, {
      ...sanitize(profileData),
      updatedAt: Date.now()
    }, { merge: true })
    return true
  } catch {
    return false
  }
}

export async function loadUserProfile(uid) {
  const ref = profileRef(uid)
  if (!ref) return null
  try {
    const snap = await getDoc(ref)
    if (snap.exists()) return snap.data()
  } catch {}
  return null
}

// Returns { ok: boolean, label: string } — used for debug panel
export async function checkFirestoreConnection(uid) {
  const db = getFirestoreDB()
  if (!db) return { ok: false, label: 'Chưa cấu hình' }
  if (!uid) return { ok: false, label: 'Chưa đăng nhập' }
  try {
    const ref = sessionRef(uid)
    await getDoc(ref)   // succeeds even when doc is missing
    return { ok: true, label: 'Đã kết nối ✓' }
  } catch (err) {
    if (err.code === 'permission-denied') return { ok: false, label: 'Lỗi quyền (rules)' }
    if (err.code === 'unavailable')       return { ok: false, label: 'Không có mạng' }
    return { ok: false, label: err.code ?? 'Lỗi kết nối' }
  }
}

// === FEEDBACK & LEADERBOARD ===

export async function submitFeedback(userId, userName, email, eventId, content) {
  const db = getFirestoreDB()
  if (!db) return false
  try {
    const feedbacksRef = collection(db, 'feedbacks')
    await addDoc(feedbacksRef, {
      userId,
      userName: userName || 'Ẩn Danh',
      email: email || '',
      eventId: eventId || 'general',
      content,
      status: 'pending',
      createdAt: serverTimestamp()
    })
    return true
  } catch (err) {
    console.error('Lỗi gửi góp ý:', err)
    return false
  }
}

export async function getTopContributors() {
  const db = getFirestoreDB()
  if (!db) return []
  try {
    const lbRef = collection(db, 'leaderboard')
    const q = query(lbRef, orderBy('score', 'desc'), limit(20))
    const snap = await getDocs(q)
    const results = []
    snap.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() })
    })
    return results
  } catch (err) {
    console.error('Lỗi lấy leaderboard:', err)
    return []
  }
}

// ─── LÔI ĐÀI (ARENA) ─────────────────────────────────────────────────────────────

export async function submitArenaScore(userId, playerName, score) {
  const db = getFirestoreDB()
  if (!db) return false
  try {
    const arenaRef = doc(db, 'arenaScores', userId)
    
    const docSnap = await getDoc(arenaRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      if (data.score >= score) return true // Keep existing high score
    }

    await setDoc(arenaRef, {
      userId,
      playerName: playerName || 'Ẩn Danh',
      score,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (err) {
    console.error('Lỗi lưu điểm Lôi Đài:', err)
    return false
  }
}

export async function getTopArenaPlayers(limitCount = 50) {
  const db = getFirestoreDB()
  if (!db) return []
  try {
    const arenaRef = collection(db, 'arenaScores')
    const q = query(arenaRef, orderBy('score', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (err) {
    console.error('Lỗi lấy Bảng Vàng Lôi Đài:', err)
    return []
  }
}
