import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase'

/** Generate a 6-digit numeric OTP */
export function generateOtp() {
  return String(crypto.randomInt(100000, 1000000))
}

/** Generate a cryptographically secure URL-safe token */
export function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Invalidate all previous unused tokens of the same type for the email,
 * then insert a fresh one. Returns the plain token.
 */
export async function createToken(email, type, ttlMinutes = 10) {
  const supabase = createServiceClient()
  const token = type === 'email_verification' ? generateOtp() : generateSecureToken()
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString()

  // Invalidate existing unused tokens of same type for this email
  await supabase
    .from('verification_tokens')
    .update({ used: true })
    .eq('email', email)
    .eq('type', type)
    .eq('used', false)

  const { error } = await supabase.from('verification_tokens').insert({
    email,
    token,
    type,
    expires_at: expiresAt,
  })

  if (error) throw error
  return token
}

/**
 * Look up a token, check it is valid (not used, not expired),
 * mark it used, and return the row.
 * Pass `email` for short codes (OTP) so a code can only match its own account.
 */
export async function consumeToken(token, type, email) {
  const supabase = createServiceClient()

  let query = supabase
    .from('verification_tokens')
    .select('*')
    .eq('token', token)
    .eq('type', type)
    .eq('used', false)
  if (email) query = query.eq('email', email)

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) return { valid: false, reason: 'Invalid or already used code' }
  if (new Date(data.expires_at) < new Date()) return { valid: false, reason: 'Code has expired' }

  // Mark as used — conditional update so two parallel requests can't both use it
  const { data: claimed } = await supabase
    .from('verification_tokens')
    .update({ used: true })
    .eq('id', data.id)
    .eq('used', false)
    .select('id')
  if (!claimed?.length) return { valid: false, reason: 'Invalid or already used code' }

  return { valid: true, email: data.email }
}
