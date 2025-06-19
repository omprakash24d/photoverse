
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 font-body">
      <PageHeader />
      <main className="w-full max-w-3xl flex-grow prose dark:prose-invert">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
        <h1 className="font-headline text-3xl sm:text-4xl text-primary mb-6">Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="font-headline text-2xl mt-6 mb-3">1. Acceptance of Terms</h2>
        <p>By accessing and using PhotoVerse (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Service, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this Service will constitute acceptance of this agreement.</p>

        <h2 className="font-headline text-2xl mt-6 mb-3">2. Description of Service</h2>
        <p>PhotoVerse is an AI-powered tool that transforms user-provided images and/or text descriptions into poems. The Service uses artificial intelligence models to generate content based on your inputs.</p>

        <h2 className="font-headline text-2xl mt-6 mb-3">3. User Conduct and Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are solely responsible for the images and text you upload or input into the Service ("User Content").</li>
          <li>You agree not to use the Service to upload, post, email, transmit, or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.</li>
          <li>You represent and warrant that you own or have the necessary licenses, rights, consents, and permissions to use and authorize us to use all patent, trademark, trade secret, copyright, or other proprietary rights in and to any and all User Content.</li>
          <li>You understand that the poems generated are created by AI and may not always be accurate, appropriate, or meet your expectations.</li>
        </ul>

        <h2 className="font-headline text-2xl mt-6 mb-3">4. Intellectual Property</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>User Content:</strong> You retain all of your ownership rights in your User Content. However, by submitting User Content to PhotoVerse, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Service and our business, including for promoting and redistributing part or all of the Service.</li>
          <li><strong>Generated Poems:</strong> The ownership of AI-generated poems can be complex and may depend on the terms of the AI models used and applicable laws. While you are generally free to use the poems generated for personal, non-commercial purposes, you should be aware that the AI model provider may have its own terms regarding commercial use or ownership of AI-generated content.</li>
          <li><strong>Our Service:</strong> All rights, title, and interest in and to the Service (excluding User Content) are and will remain the exclusive property of PhotoVerse and its licensors.</li>
        </ul>

        <h2 className="font-headline text-2xl mt-6 mb-3">5. Disclaimer of Warranties</h2>
        <p>The Service is provided "as is" and "as available" without any warranties of any kind, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.</p>
        
        <h2 className="font-headline text-2xl mt-6 mb-3">6. Limitation of Liability</h2>
        <p>In no event shall PhotoVerse, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.</p>

        <h2 className="font-headline text-2xl mt-6 mb-3">7. Modifications to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page and updating the "Last updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>

        <h2 className="font-headline text-2xl mt-6 mb-3">8. Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction, e.g., State of California, USA], without regard to its conflict of law provisions.</p>
        
        <h2 className="font-headline text-2xl mt-6 mb-3">9. Contact Us</h2>
        <p>If you have any questions about these Terms, please <Link href="/contact-us" className="text-primary hover:underline">contact us</Link>.</p>

        <p className="mt-8 text-sm text-muted-foreground">
          This is a sample Terms of Service. You should consult with a legal professional to ensure it meets your specific needs and complies with all applicable laws and regulations. Remember to replace "[Your Jurisdiction]" with the appropriate legal jurisdiction.
        </p>
      </main>
      <PageFooter />
    </div>
  );
}
