"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulation d'une API de connexion
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Utilisateurs de test
    const testUsers = [
      {
        id: "1",
        email: "admin@company.com",
        password: "admin123",
        name: "Administrateur",
        role: "Administrateur",
      },
      {
        id: "2",
        email: "manager@company.com",
        password: "manager123",
        name: "Manager",
        role: "Manager",
      },
      {
        id: "3",
        email: "operator@company.com",
        password: "operator123",
        name: "Opérateur",
        role: "Opérateur",
      },
    ]

    const foundUser = testUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}
