
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 font-body">
      <PageHeader />
      <main className="w-full max-w-3xl flex-grow prose dark:prose-invert">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
        <h1 className="font-headline text-3xl sm:text-4xl text-primary mb-6">Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="font-headline text-2xl mt-6 mb-3">Introduction</h2>
        <p>Welcome to PhotoVerse ("we," "our," "us"). We are committed to protecting your privacy. This Privacy Policy explains how your information is collected, used, and disclosed by PhotoVerse when you use our website and services (collectively, the "Service").</p>
        <p>By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Service.</p>

        <h2 className="font-headline text-2xl mt-6 mb-3">Information We Collect</h2>
        <p>We collect information in the following ways:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Information you provide directly:</strong>
            <ul className="list-circle pl-6 mt-1 space-y-1">
              <li>When you upload an image, we process this image to generate a description. The image is sent to our AI service for this purpose. We do not store your uploaded images permanently on our servers after the description is generated and your session ends, unless you are signed in and explicitly use a future "save" feature.</li>
              <li>When you provide a text description or poem customization preferences (language, style, tone, length, custom instructions), this information is used to generate the poem. This data is also processed in memory and not stored permanently unless explicitly saved by a logged-in user via a future feature.</li>
              <li>If you sign up for an account using Clerk (e.g., via Google or other methods), Clerk handles your authentication and provides us with basic profile information (like name, email, profile picture) to identify you. We do not store your passwords.</li>
            </ul>
          </li>
          <li><strong>Information collected automatically:</strong>
            <ul className="list-circle pl-6 mt-1 space-y-1">
              <li>We may collect standard web log information, such as your IP address, browser type, and operating system, for analytical and security purposes. This data is typically anonymized or aggregated.</li>
            </ul>
          </li>
        </ul>

        <h2 className="font-headline text-2xl mt-6 mb-3">How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, operate, and maintain our Service.</li>
          <li>Generate image descriptions and poems as requested by you.</li>
          <li>Improve, personalize, and expand our Service.</li>
          <li>Understand and analyze how you use our Service.</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the Service, and for marketing and promotional purposes (if you opt-in).</li>
          <li>Process your transactions (if applicable for future features).</li>
          <li>Find and prevent fraud.</li>
        </ul>
        
        <h2 className="font-headline text-2xl mt-6 mb-3">Sharing Your Information</h2>
        <p>We do not sell, rent, or share your personal information with third parties except in the circumstances described below:</p>
        <ul className="list-disc pl-6 space-y-2">
            <li><strong>AI Service Providers:</strong> Your uploaded images and text inputs are shared with third-party AI service providers (e.g., Google AI via Genkit) solely for the purpose of generating descriptions and poems. These providers have their own privacy policies.</li>
            <li><strong>Authentication Provider:</strong> If you sign in, your authentication is handled by Clerk, Inc. Their privacy policy governs the data they collect.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend our rights or property, prevent fraud, act in urgent circumstances to protect the personal safety of users of the Service, or protect against legal liability.</li>
        </ul>

        <h2 className="font-headline text-2xl mt-6 mb-3">Data Security</h2>
        <p>We use industry-standard security measures, including HTTPS, to protect your information. However, no electronic transmission or storage of information can be completely secure, so we cannot guarantee absolute security.</p>

        <h2 className="font-headline text-2xl mt-6 mb-3">Your Choices</h2>
         <ul className="list-disc pl-6 space-y-2">
          <li>You can choose not to provide certain information, but this may prevent you from using certain features of the Service.</li>
          <li>If you have an account, you may be able to update or delete your information through your account settings (managed by Clerk).</li>
        </ul>

        <h2 className="font-headline text-2xl mt-6 mb-3">Children's Privacy</h2>
        <p>Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.</p>

        <h2 className="font-headline text-2xl mt-6 mb-3">Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>

        <h2 className="font-headline text-2xl mt-6 mb-3">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please <Link href="/contact-us" className="text-primary hover:underline">contact us</Link>.</p>
        <p className="mt-8 text-sm text-muted-foreground">
          This is a sample Privacy Policy. You should consult with a legal professional to ensure it meets your specific needs and complies with all applicable laws and regulations.
        </p>
      </main>
      <PageFooter />
    </div>
  );
}
