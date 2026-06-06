import { use } from 'react'
import { AuthContext } from '~/context/AuthContext'

export function useAuth() {
  const context = use(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth() can only be used inside of <AuthProvider />')
  }

  return context
}
