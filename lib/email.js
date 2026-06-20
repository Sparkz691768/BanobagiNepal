import nodemailer from 'nodemailer'

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

const FROM = process.env.SMTP_FROM || 'BanobagiNepal <noreply@banobagiNepal.com>'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendOtpEmail(email, otp, name) {
  const transporter = createTransport()
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Verify your BanobagiNepal account',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FAF9F7;border:1px solid #e5e7eb;">
        <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#1A1A2E;margin:0 0 8px;">BanobagiNepal</h1>
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7F8C8D;margin:0 0 32px;">Korean Beauty</p>

        <p style="color:#2C3E50;font-size:14px;margin:0 0 8px;">Hi${name ? ' ' + name : ''},</p>
        <p style="color:#2C3E50;font-size:14px;margin:0 0 24px;line-height:1.6;">
          Welcome! Please use the verification code below to confirm your email address.
          This code expires in <strong>10 minutes</strong>.
        </p>

        <div style="background:#1A5C8A;padding:20px;text-align:center;margin:0 0 24px;">
          <span style="font-family:monospace;font-size:36px;font-weight:700;letter-spacing:0.3em;color:#ffffff;">${otp}</span>
        </div>

        <p style="color:#7F8C8D;font-size:12px;margin:0;line-height:1.6;">
          If you did not create a BanobagiNepal account, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email, token, name) {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`
  const transporter = createTransport()
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Reset your BanobagiNepal password',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FAF9F7;border:1px solid #e5e7eb;">
        <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#1A1A2E;margin:0 0 8px;">BanobagiNepal</h1>
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7F8C8D;margin:0 0 32px;">Korean Beauty</p>

        <p style="color:#2C3E50;font-size:14px;margin:0 0 8px;">Hi${name ? ' ' + name : ''},</p>
        <p style="color:#2C3E50;font-size:14px;margin:0 0 24px;line-height:1.6;">
          We received a request to reset your password. Click the button below to choose a new one.
          This link expires in <strong>30 minutes</strong>.
        </p>

        <a href="${resetUrl}"
           style="display:inline-block;background:#1A5C8A;color:#ffffff;text-decoration:none;
                  font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;
                  padding:14px 32px;margin:0 0 24px;">
          Reset Password
        </a>

        <p style="color:#7F8C8D;font-size:12px;margin:0 0 8px;">
          Or copy this link into your browser:
        </p>
        <p style="color:#1A5C8A;font-size:12px;word-break:break-all;margin:0 0 24px;">${resetUrl}</p>

        <p style="color:#7F8C8D;font-size:12px;margin:0;line-height:1.6;">
          If you did not request a password reset, your account is safe — no changes were made.
        </p>
      </div>
    `,
  })
}
