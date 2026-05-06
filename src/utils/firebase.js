import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getFirestoreDB } from '../lib/firebase'

/**
 * Ghi crash report lên Firestore collection 'crashes'.
 * Dùng singleton Firebase app từ lib/firebase để tránh duplicate app error.
 */
export const logCrashToFirestore = async (error, errorInfo) => {
  const db = getFirestoreDB()
  if (!db) return

  try {
    await addDoc(collection(db, 'crashes'), {
      message: error.toString(),
      stack: error.stack || '',
      componentStack: errorInfo?.componentStack || '',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
      timestamp: serverTimestamp()
    })
    console.log('✅ Crash logged to Firestore')
  } catch (e) {
    console.error('❌ Error logging crash to Firestore:', e)
  }
}
