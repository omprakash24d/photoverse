
import { type Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const siteMetadata: Metadata = {
  title: 'PhotoVerse: AI Poem Generator - Photos & Ideas to Poetry | By Om Prakash',
  description:
    "Unleash your creativity with PhotoVerse! Instantly generate unique, emotionally resonant poems from your photos or text descriptions. Customize language, style, and tone. Try Om Prakash's AI Poem Generator today!",
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
    'AI poem generator from image',
    'text to poem AI',
    'creative writing AI tool',
    'personalized poetry generator',
    'Hinglish poems AI',
    'Haiku generator AI',
    'free verse AI poem',
    'PhotoVerse app',
    'Om Prakash AI project',
    'image to text to poem',
    'AI poetry tool',
    'generate poems online',
    'AI for poets',
    'unique poem creator',
  ],
  authors: [
    { name: 'Om Prakash', url: 'https://www.linkedin.com/in/om-prakash-yadav-991b29150/' },
  ],
  creator: 'Om Prakash',
  publisher: 'Om Prakash',
  applicationName: 'PhotoVerse',
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'PhotoVerse: AI Poem Generator - Photos & Ideas to Poetry',
    description:
      'Transform images or text into unique AI-generated poems with PhotoVerse. Customize language, style, and tone for personalized poetry. An innovative tool by Om Prakash.',
    images: [
      {
        url: `${siteUrl}/og-image.png`, // Ensure this image exists in your /public folder
        width: 1200,
        height: 630,
        alt: 'PhotoVerse AI Poem Generator - Transform images and ideas into poetry.',
      },
    ],
    siteName: 'PhotoVerse',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhotoVerse: AI Poem Generator - Photos & Ideas to Poetry by Om Prakash',
    description: 'Create stunning poems from your photos or text descriptions using AI. Explore PhotoVerse by Om Prakash and unleash your inner poet!',
    images: [`${siteUrl}/twitter-image.png`], // Ensure this image exists in your /public folder
    // creator: '@YourTwitterHandle', // Add your Twitter handle if available
    // site: '@YourTwitterHandle', // Add your site's Twitter handle if available
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
  // For structured data (JSON-LD), you would typically add a <script type="application/ld+json">
  // in your RootLayout or specific page components.
  // Example:
  // metadataBase: new URL(siteUrl),
  // alternates: {
  //   canonical: '/',
  //   languages: {
  //     'en-US': '/en-US',
  //   },
  // },
}
