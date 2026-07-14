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

  // Register user
  async function signup(email, password, displayName) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName })
      return cred.user
    } catch (err) {
      throw _mapFirebaseError(err)
    }
  }

  // Login user
  async function login(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      return cred.user
    } catch (err) {
      throw _mapFirebaseError(err)
    }
  }

  // Google Login
  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      toast.success('Signed in with Google!')
      return result.user
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return null
      throw _mapFirebaseError(err)
    }
  }

  // Logout user
  function logout() {
    return signOut(auth)
  }

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Helper to handle Firebase error messages gracefully
function _mapFirebaseError(err) {
  const map = {
    'auth/user-not-found': 'No user found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'Email is already registered.',
  }
  const msg = map[err.code] || err.message || 'An error occurred.'
  return new Error(msg)
}