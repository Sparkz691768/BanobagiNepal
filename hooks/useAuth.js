import { useSession } from 'next-auth/react'

export default function useAuth() {
  const { data: session, status } = useSession()
  return {
    user: session?.user ?? null,
    isLoggedIn: status === 'authenticated',
    isAdmin: session?.user?.role === 'admin',
    isEmployee:
      session?.user?.role === 'employee' ||
      session?.user?.role === 'admin',
    isLoading: status === 'loading',
  }
}
