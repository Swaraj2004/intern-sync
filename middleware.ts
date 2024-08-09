import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /* Match all request paths except for the ones starting with: */
    '/((?!_next/static|_next/image|favicon.ico|error|api|auth|verify-email|update-password|set-password|logout|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
