import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiProtection } from './middleware/api-protection';

export async function middleware(request: NextRequest) {
  // Only apply protection to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return apiProtection(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};