import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase'
import { isRateLimited, recordAttempt, clearAttempts } from '@/lib/rateLimit'

const SESSION_RECHECK_MS = 5 * 60 * 1000

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Brute-force protection: max 10 failed logins per email per 15 minutes
        if (await isRateLimited(credentials.email, 'login_fail', 10, 15)) return null

        const supabase = createServiceClient()
        const { data: user } = await supabase
          .from('users')
          .select()
          .eq('email', credentials.email)
          .eq('is_active', true)
          .maybeSingle()

        if (!user) {
          await recordAttempt(credentials.email, 'login_fail', 15)
          return null
        }

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) {
          await recordAttempt(credentials.email, 'login_fail', 15)
          return null
        }
        await clearAttempts(credentials.email, 'login_fail')

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          employee_id: user.employee_id,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.employee_id = user.employee_id
        token.id = user.id
        token.checkedAt = Date.now()
        return token
      }
      if (token.revoked) return token

      // Re-check the account every few minutes so deactivated users / changed
      // roles lose access instead of keeping it until the JWT expires.
      if (!token.checkedAt || Date.now() - token.checkedAt > SESSION_RECHECK_MS) {
        try {
          const supabase = createServiceClient()
          const { data: dbUser, error } = await supabase
            .from('users')
            .select('role, is_active')
            .eq('id', token.id)
            .maybeSingle()
          if (!error) {
            if (!dbUser || !dbUser.is_active) return { revoked: true }
            token.role = dbUser.role
            token.checkedAt = Date.now()
          }
        } catch {
          // keep existing token on transient DB errors
        }
      }
      return token
    },
    async session({ session, token }) {
      // Empty session object => getServerSession/useSession treat user as signed out
      if (token.revoked) return {}
      session.user.role = token.role
      session.user.employee_id = token.employee_id
      session.user.id = token.id
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
