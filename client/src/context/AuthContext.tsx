import React, { useEffect, useState, useCallback } from 'react'
import type { User } from '../types/auth'
import { api, getAuthToken, setAuthToken } from '../utils/api'
import { AuthContext } from './authContextDef'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(getAuthToken())
  const [isLoading, setIsLoading] = useState<boolean>(() => !!getAuthToken())
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)

  // Verify and hydrate current user on mount if token exists
  useEffect(() => {
    const existingToken = getAuthToken()
    if (!existingToken) return

    api.auth
      .me()
      .then((profile) => {
        setUser(profile)
        setTokenState(existingToken)
      })
      .catch((err) => {
        console.warn('Session expired or invalid token:', err)
        setAuthToken(null)
        setTokenState(null)
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const loginWithGoogle = useCallback(async (credential: string) => {
    setIsLoading(true)
    try {
      const res = await api.auth.google(credential)
      setAuthToken(res.access_token)
      setTokenState(res.access_token)
      setUser({
        id: res.user.id,
        email: res.user.email,
        name: res.user.name,
        avatarUrl: res.user.avatar_url,
        googleId: res.user.google_id,
        createdAt: res.user.created_at,
        lastLogin: res.user.last_login,
      })
      setIsAuthModalOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loginAsDemo = useCallback(async (email?: string, name?: string) => {
    setIsLoading(true)
    try {
      const res = await api.auth.demoLogin(email, name)
      setAuthToken(res.access_token)
      setTokenState(res.access_token)
      setUser({
        id: res.user.id,
        email: res.user.email,
        name: res.user.name,
        avatarUrl: res.user.avatar_url,
        googleId: res.user.google_id,
        createdAt: res.user.created_at,
        lastLogin: res.user.last_login,
      })
      setIsAuthModalOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.auth.logout()
    } catch {
      // ignore
    } finally {
      setAuthToken(null)
      setTokenState(null)
      setUser(null)
    }
  }, [])

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), [])
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
