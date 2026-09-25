import { createServiceClient } from '@/lib/supabase'

/**
 * Simple DB-backed rate limiter that reuses the verification_tokens table
 * (no schema change needed). Each attempt is stored as a row with
 * type = `rl_<action>`; rows older than the window are ignored.
 */
export async function isRateLimited(key, action, max, windowMinutes) {
  const supabase = createServiceClient()
  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString()
  const { count, error } = await supabase
    .from('verification_tokens')
    .select('id', { count: 'exact', head: true })
    .eq('email', key)
    .eq('type', `rl_${action}`)
    .gte('created_at', since)

  if (error) return false // fail open so a DB hiccup never locks users out
  return (count || 0) >= max
}

export async function recordAttempt(key, action, windowMinutes) {
  const supabase = createServiceClient()
  await supabase.from('verification_tokens').insert({
    email: key,
    token: '-',
    type: `rl_${action}`,
    used: true,
    expires_at: new Date(Date.now() + windowMinutes * 60 * 1000).toISOString(),
  })
}

export async function clearAttempts(key, action) {
  const supabase = createServiceClient()
  await supabase
    .from('verification_tokens')
    .delete()
    .eq('email', key)
    .eq('type', `rl_${action}`)
}
