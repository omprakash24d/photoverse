import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Fallback for local dev

export const metadata: Metadata = {
  title: 'PhotoVerse - AI Poem Generator from Images by Om Prakash',
  description: 'Transform your photos into emotionally resonant, AI-generated poems. Upload an image, get an AI description, customize poem settings, and receive a unique piece of poetry. Created by Om Prakash.',
  keywords: ['AI poem generator', 'photo to poem', 'image to poetry', 'AI creative writing', 'PhotoVerse', 'Om Prakash', 'image analysis', 'poetry generation', 'emotional poems', 'personalized poetry', 'AI art', 'creative AI'],
  authors: [{ name: 'Om Prakash', url: 'https://www.linkedin.com/in/om-prakash-yadav-991b29150/' }], // Replace with actual link if available
  creator: 'Om Prakash',
  publisher: 'Om Prakash',
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'PhotoVerse - AI Poem Generator from Images',
    description: 'Turn your photos into unique, AI-generated poems with PhotoVerse. An innovative tool by Om Prakash.',
    images: [
      {
        url: `${siteUrl}/og-image.png`, // You'll need to create this image or use a placeholder
        width: 1200,
        height: 630,
        alt: 'PhotoVerse - AI Poem Generator',
      },
    ],
    siteName: 'PhotoVerse',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@YourTwitterHandle', // Replace with actual Twitter handle
    creator: '@YourTwitterHandle', // Replace with actual Twitter handle
    title: 'PhotoVerse - AI Poem Generator by Om Prakash',
    description: 'Create beautiful poems from your photos using AI. Explore PhotoVerse by Om Prakash.',
    images: [`${siteUrl}/twitter-image.png`], // You'll need to create this image or use a placeholder
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
  // icons: { // Add if you have a favicon
  //   icon: '/favicon.ico',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: `${siteUrl}/site.webmanifest`, // Add if you have a manifest file
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        {/* You might want to add a canonical link tag here if your site will have multiple URLs for the same content */}
        {/* <link rel="canonical" href={siteUrl} /> */}
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
