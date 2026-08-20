import { auth } from '@/lib/auth/auth'
import { NextResponse } from 'next/server'

const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/privacy', '/terms']
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
const publicApiRoutes = ['/api/auth']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))
  if (isPublicApiRoute) {
    return NextResponse.next()
  }

  const isAuthRoute = authRoutes.some(route => pathname === route)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
    return NextResponse.next()
  }

  const isPublicRoute = publicRoutes.some(route => pathname === route)
  if (!isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
