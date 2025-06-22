
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

// Check if Clerk is configured. We'll use this to conditionally run the middleware.
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled = !!(PUBLISHABLE_KEY && PUBLISHABLE_KEY.trim() !== 'YOUR_CLERK_PUBLISHABLE_KEY');

// Define the routes that should be protected if Clerk is enabled.
// By default, no routes are protected.
const isProtectedRoute = createRouteMatcher([]);

// The actual middleware function that Next.js will execute.
export default function middleware(req: NextRequest) {
  // If Clerk is not enabled, we don't do anything.
  // The request is passed through to the next handler.
  // Returning nothing from a middleware is equivalent to NextResponse.next().
  if (!isClerkEnabled) {
    return;
  }

  // If Clerk IS enabled, we create and execute the Clerk middleware.
  // This function is only created and called if the keys are valid,
  // preventing the "Publishable key not valid" error.
  const clerkMiddlewareHandler = clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) {
      auth().protect();
    }
  });

  return clerkMiddlewareHandler(req);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
