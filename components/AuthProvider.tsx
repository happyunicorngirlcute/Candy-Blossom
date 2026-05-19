"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (token: string, user: string) => void;
  logout: () => void;
  loading: boolean;
}>({
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // In a real application, check for a token/session here
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) setIsAuthenticated(true)
    setLoading(false)
  }, [])

  const login = (token: string, user: string) => {
    setIsAuthenticated(true)
    localStorage.setItem("token", token)
    localStorage.setItem("user", user)
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
