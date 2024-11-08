import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('token')?.value || ''
  console.log('Token:', token);

  // Public paths that do not require authentication
  const isPublicPath = path === '/login' || path === '/signup' || path === '/'

  // Protected paths that require authentication
  const isProtectedPath = path === '/dashboard'

  // Redirect to the dashboard if a logged-in user tries to access login/signup
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  // Redirect to login if an unauthenticated user tries to access a protected path
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Allow access to the requested page if none of the above conditions are met
  return NextResponse.next()
}

// Apply middleware to specific paths
export const config = {
  matcher: ['/login', '/signup', '/', '/dashboard'],
}
