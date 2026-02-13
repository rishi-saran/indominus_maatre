import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Routes that require authentication
  const protectedRoutes = ['/profile', '/cart'];
  
  // Root path is also protected (Coming Soon page requires login)
  const isRootPath = pathname === '/';
  
  // Check if current path is a protected route
  const isProtectedRoute = isRootPath || protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const userIdCookie = request.cookies.get('user_id')?.value;
    const userEmailCookie = request.cookies.get('user_email')?.value;
    
    console.log('[Middleware] Checking auth for:', pathname);
    console.log('[Middleware] Cookies:', { userId: !!userIdCookie, email: !!userEmailCookie });
    
    // If no auth cookies, redirect to login
    if (!userIdCookie || !userEmailCookie) {
      console.log('[Middleware] No auth found - redirecting to /login');
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('[Middleware] Auth verified - allowing access');
  }
  
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/',
    '/profile',
    '/profile/:path*',
    '/cart',
    '/cart/:path*'
  ],
};
