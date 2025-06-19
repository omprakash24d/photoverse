import { type Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const siteMetadata: Metadata = {
  title: 'PhotoVerse - AI Poem Generator from Images by Om Prakash',
  description:
    'Transform your photos into emotionally resonant, AI-generated poems. Upload an image, get an AI description, customize poem settings, and receive a unique piece of poetry. Created by Om Prakash.',
  keywords: [
    'AI poem generator',
    'photo to poem',
    'image to poetry',
    'AI creative writing',
    'PhotoVerse',
    'Om Prakash',
    'image analysis',
    'poetry generation',
    'emotional poems',
    'personalized poetry',
    'AI art',
    'creative AI',
  ],
  authors: [
    { name: 'Om Prakash', url: 'https://www.linkedin.com/in/om-prakash-yadav-991b29150/' },
  ],
  creator: 'Om Prakash',
  publisher: 'Om Prakash',
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'PhotoVerse - AI Poem Generator from Images',
    description:
      'Turn your photos into unique, AI-generated poems with PhotoVerse. An innovative tool by Om Prakash.',
    images: [
      {
        url: `${siteUrl}/og-image.png`, // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'PhotoVerse - AI Poem Generator',
      },
    ],
    siteName: 'PhotoVerse',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@YourTwitterHandle', // Consider replacing with an actual handle or removing
    creator: '@YourTwitterHandle', // Consider replacing with an actual handle or removing
    title: 'PhotoVerse - AI Poem Generator by Om Prakash',
    description: 'Create beautiful poems from your photos using AI. Explore PhotoVerse by Om Prakash.',
    images: [`${siteUrl}/twitter-image.png`], // You'll need to create this image
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
}
