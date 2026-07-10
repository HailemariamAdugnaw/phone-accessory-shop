import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase/config'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setLoading(false)

      // If user is signed in, verify with backend
      if (user) {
        try {
          const token = await user.getIdToken()
          await api.post('/auth/verify/', { id_token: token })
        } catch (err) {
          console.error('Backend verification failed:', err)
        }
      }
    })
    return unsubscribe
  }, [])

  async function signup(email, password, displayName) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(cred.user, { displayName })
      }
      const token = await cred.user.getIdToken()
      await api.post('/auth/verify/', { id_token: token })
      toast.success('Account created successfully!')
      return cred.user
    } catch (err) {
      throw _mapFirebaseError(err)
    }
  }

  async function login(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const token = await cred.user.getIdToken()
      await api.post('/auth/verify/', { id_token: token })
      toast.success('Welcome back!')
      return cred.user
    } catch (err) {
      throw _mapFirebaseError(err)
    }
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      await api.post('/auth/verify/', { id_token: token })
      toast.success('Signed in with Google!')
      return result.user
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return null
      throw _mapFirebaseError(err)
    }
  }

  async function logout() {
    await signOut(auth)
    toast.success('Signed out')
  }

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

function _mapFirebaseError(err) {
  const map = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  const msg = map[err.code] || err.message || 'An error occurred.'
  return new Error(msg)
}