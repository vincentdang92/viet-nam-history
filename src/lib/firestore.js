import { doc, setDoc, getDoc } from 'firebase/firestore'
import { getFirestoreDB } from './firebase'

const SESSION_DOC = 'current'

function sessionRef(uid) {
  const db = getFirestoreDB()
  if (!db || !uid) return null
  return doc(db, 'users', uid, 'sessions', SESSION_DOC)
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
