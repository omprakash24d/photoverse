import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context"; // Import AuthProvider

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Fallback for local dev

export const metadata: Metadata = {
  title: 'PhotoVerse - AI Poem Generator from Images by Om Prakash',
  description: 'Transform your photos into emotionally resonant, AI-generated poems. Upload an image, get an AI description, customize poem settings, and receive a unique piece of poetry. Created by Om Prakash.',
  keywords: ['AI poem generator', 'photo to poem', 'image to poetry', 'AI creative writing', 'PhotoVerse', 'Om Prakash', 'image analysis', 'poetry generation', 'emotional poems', 'personalized poetry', 'AI art', 'creative AI'],
  authors: [{ name: 'Om Prakash', url: 'https://www.linkedin.com/in/om-prakash-yadav-991b29150/' }], 
  creator: 'Om Prakash',
  publisher: 'Om Prakash',
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'PhotoVerse - AI Poem Generator from Images',
    description: 'Turn your photos into unique, AI-generated poems with PhotoVerse. An innovative tool by Om Prakash.',
    images: [
      {
        url: `${siteUrl}/og-image.png`, 
        width: 1200,
        height: 630,
        alt: 'PhotoVerse - AI Poem Generator',
      },
    ],
    siteName: 'PhotoVerse',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@YourTwitterHandle', 
    creator: '@YourTwitterHandle', 
    title: 'PhotoVerse - AI Poem Generator by Om Prakash',
    description: 'Create beautiful poems from your photos using AI. Explore PhotoVerse by Om Prakash.',
    images: [`${siteUrl}/twitter-image.png`], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // icons: { 
  //   icon: '/favicon.ico',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: `${siteUrl}/site.webmanifest`, 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Raleway:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider> {/* Wrap with AuthProvider */}
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}