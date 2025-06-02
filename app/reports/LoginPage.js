"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login, user } = useAuth()
  const router = useRouter()

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      setIsSubmitting(false)
      return
    }

    const success = await login(email, password)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Email ou mot de passe incorrect")
    }

    setIsSubmitting(false)
  }

  const demoAccounts = [
    { email: "admin@company.com", password: "admin123", role: "Administrateur" },
    { email: "manager@company.com", password: "manager123", role: "Manager" },
    { email: "operator@company.com", password: "operator123", role: "Opérateur" },
  ]

  const fillDemoAccount = (account) => {
    setEmail(account.email)
    setPassword(account.password)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-bold">🏭</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Connexion</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Accédez à votre espace de gestion industrielle</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600">{showPassword ? "👁️" : "👁️‍🗨️"}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </button>
            </div>
          </form>

          {/* Comptes de démonstration */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Comptes de démonstration</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillDemoAccount(account)}
                  className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs font-bold">{account.role.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{account.role}</div>
                      <div className="text-xs text-gray-500">{account.email}</div>
                    </div>
                  </div>
                  <span className="text-green-600 text-xs">Utiliser</span>
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Cliquez sur un compte pour remplir automatiquement les champs</p>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Informations de connexion</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                • <strong>Administrateur</strong> : Accès complet à toutes les fonctionnalités
              </p>
              <p>
                • <strong>Manager</strong> : Gestion des incidents et rapports
              </p>
              <p>
                • <strong>Opérateur</strong> : Saisie des opérations et incidents
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}