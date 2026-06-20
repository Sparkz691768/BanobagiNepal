import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (pathname.startsWith('/admin/employees')) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'admin' && token?.role !== 'employee') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    if (
      pathname.startsWith('/account') ||
      pathname.startsWith('/checkout')
    ) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ token }) {
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/checkout'],
}
