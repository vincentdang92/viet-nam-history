import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Your web app's Firebase configuration
// Thay thế các giá trị này bằng config thật trong file .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
let app
let db

try {
  // Only initialize if config is present
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    console.log('Firebase initialized successfully.')
  } else {
    console.warn('Firebase config missing. Crash tracking is disabled.')
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
}

export const logCrashToFirestore = async (error, errorInfo) => {
  if (!db) return
  
  try {
    await addDoc(collection(db, 'crashes'), {
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo?.componentStack || '',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
      timestamp: serverTimestamp()
    })
    console.log('Crash logged to Firestore')
  } catch (e) {
    console.error('Error logging crash:', e)
  }
}

export { app, db }
