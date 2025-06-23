
import { type NextRequest } from 'next/server';

// This middleware is a no-op after removing Clerk authentication.
export function middleware(request: NextRequest) {
  return;
}

export const config = {
  matcher: [
    // This matcher is kept to maintain the file structure, but does nothing.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
