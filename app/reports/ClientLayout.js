"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "./contexts/AuthContext"
import "./globals.css"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊", roles: ["Administrateur", "Manager", "Opérateur"] },
  {
    name: "Déclarer Incident",
    href: "/declare-incident",
    icon: "⚠️",
    roles: ["Administrateur", "Manager", "Opérateur"],
  },
  { name: "Opérations", href: "/operations", icon: "⚙️", roles: ["Administrateur", "Manager", "Opérateur"] },
  { name: "Rapports", href: "/reports", icon: "📈", roles: ["Administrateur", "Manager"] },
]

export default function ClientLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  // Afficher la page de login si pas connecté
  if (isLoading) {
    return (
      <html lang="fr">
        <body className="antialiased bg-gray-50">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  if (!user && pathname !== "/login") {
    router.push("/login")
    return null
  }

  if (pathname === "/login") {
    return (
      <html lang="fr">
        <body className="antialiased bg-gray-50">{children}</body>
      </html>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Filtrer la navigation selon le rôle de l'utilisateur
  const filteredNavigation = navigation.filter((item) => user && item.roles.includes(user.role))

  return (
    <html lang="fr">
      <body className="antialiased bg-gray-50">
        <div className="flex h-screen">
          {/* Sidebar mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-center h-16 px-4 bg-green-600">
                <h1 className="text-xl font-bold text-white">Gestion Industrielle</h1>
              </div>

              {/* User info */}
              {user && (
                <div className="px-4 py-3 bg-green-50 border-b border-green-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-green-100 text-green-700 border-r-4 border-green-500"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Footer avec logout */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span className="mr-3 text-lg">🚪</span>
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top bar */}
            <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Gestion Industrielle</h1>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700" title="Déconnexion">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}