
"use client";

import Link from 'next/link';
import { useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Linkedin, Twitter, Github, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactUsPage() {
  const contactEmail = "om@indhinditech.com"; 
  const { toast } = useToast();

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(contactEmail).then(() => {
      toast({
        title: "Email Copied!",
        description: `${contactEmail} has been copied to your clipboard.`,
      });
    }).catch(err => {
      console.error('Failed to copy email: ', err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy the email to your clipboard.",
      });
    });
  }, [contactEmail, toast]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 font-body">
      <PageHeader />
      <main className="w-full max-w-3xl flex-grow">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>
        <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="font-headline text-3xl sm:text-4xl text-primary mb-6 text-center">Contact Us</h1>
          <p className="text-center text-muted-foreground mb-8">
            We'd love to hear from you! Whether you have a question about PhotoVerse, feedback, or just want to say hello, feel free to reach out.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between space-x-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 overflow-hidden">
                <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <h2 className="font-semibold text-lg">Email Us Directly</h2>
                  <a href={`mailto:${contactEmail}`} className="text-accent hover:underline break-all">
                    {contactEmail}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1 truncate">For direct inquiries and support.</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCopyEmail} aria-label="Copy email address" className="flex-shrink-0">
                <Copy className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-10 pt-6 border-t border-border">
              <h2 className="font-semibold text-lg text-center mb-6">Connect with Om Prakash</h2>
              <div className="flex justify-center space-x-6 sm:space-x-8">
                <a href="https://www.linkedin.com/in/omrakash24d/" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-8 w-8" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a href="https://twitter.com/omprakash25d" target="_blank" rel="noopener noreferrer" title="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-8 w-8" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="https://github.com/omprakash24d" target="_blank" rel="noopener noreferrer" title="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-8 w-8" />
                  <span className="sr-only">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
