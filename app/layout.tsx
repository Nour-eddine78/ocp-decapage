import type React from "react"
import { AuthProvider } from "./contexts/AuthContext"
import ClientLayout from "./ClientLayout"

import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ClientLayout>{children}</ClientLayout>
    </AuthProvider>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
