import { NextResponse } from 'next/server'

// Registration is handled via OTP flow: /api/auth/send-otp → /api/auth/verify-email
// This endpoint is disabled to prevent bypassing email verification.
export async function POST() {
  return NextResponse.json(
    { error: 'Use the OTP registration flow instead.' },
    { status: 410 }
  )
}
