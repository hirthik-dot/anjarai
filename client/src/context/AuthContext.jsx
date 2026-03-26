// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext()
const rawApi = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const API = rawApi.endsWith('/api') ? rawApi : `${rawApi.replace(/\/$/, '')}/api`
const STORAGE_KEY = 'tmc_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [loginOpen,  setLoginOpen]  = useState(false)
  const [loginStep,  setLoginStep]  = useState(1)  // 1: name+email, 2: OTP, 3: welcome
  const [loginData,  setLoginData]  = useState({ name: '', email: '' })

  const login = useCallback((userData, token) => {
    const payload = { ...userData, token }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setUser(payload)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const openLogin = useCallback(() => {
    setLoginStep(1)
    setLoginData({ name: '', email: '' })
    setLoginOpen(true)
  }, [])

  const closeLogin = useCallback(() => {
    setLoginOpen(false)
    setTimeout(() => {
      setLoginStep(1)
      setLoginData({ name: '', email: '' })
    }, 300)
  }, [])

  const getAuthHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(user?.token && { 'Authorization': `Bearer ${user.token}` })
  }), [user])

  // Verify token on mount — silently logout if expired
  useEffect(() => {
    if (!user?.token) return
    fetch(`${API}/auth/otp/me`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(r => { if (!r.ok) logout() })
      .catch(() => {})
  }, []) // eslint-disable-line

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      loginOpen, openLogin, closeLogin,
      loginStep, setLoginStep,
      loginData, setLoginData,
      getAuthHeaders,
      isLoggedIn: !!user,
      API,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
