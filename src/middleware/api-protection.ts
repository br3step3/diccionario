import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 50; // Maximum requests per window

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);

export async function apiProtection(req: NextRequest) {
  // Get client IP
  const ip = headers().get('x-forwarded-for') || 'unknown';

  // Check API key
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    return new NextResponse('API key not configured', { status: 500 });
  }

  // Rate limiting
  const now = Date.now();
  const clientData = rateLimitStore.get(ip) || { count: 0, timestamp: now };

  // Reset count if window has passed
  if (now - clientData.timestamp > RATE_LIMIT_WINDOW) {
    clientData.count = 0;
    clientData.timestamp = now;
  }

  // Increment request count
  clientData.count++;
  rateLimitStore.set(ip, clientData);

  // Check if rate limit exceeded
  if (clientData.count > MAX_REQUESTS) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  return NextResponse.next();
}