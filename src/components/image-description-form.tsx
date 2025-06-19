"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, SkipForward, RefreshCw } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface ImageDescriptionFormProps {
  imageDataUrl: string;
  initialDescription: string;
  isFetchingDescription: boolean;
  onDescriptionConfirm: (description: string) => void;
  onSkip: (currentDescription: string) => void;
  onFetchDescriptionRequest?: () => void; // Optional: if user wants to re-trigger AI description
}

export function ImageDescriptionForm({
  imageDataUrl,
  initialDescription,
  isFetchingDescription,
  onDescriptionConfirm,
  onSkip,
  onFetchDescriptionRequest,
}: ImageDescriptionFormProps) {
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  const handleConfirm = () => {
    onDescriptionConfirm(description.trim() === "" ? "A beautiful scene" : description);
  };
  
  const handleSkip = () => {
    onSkip(description); // Pass current description even if skipping AI
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Describe Your Image</CardTitle>
        <CardDescription className="text-center font-body">
          Our AI has tried to describe your image. Review or edit it below, or skip to write your own.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border border-muted shadow-inner relative">
          <Image src={imageDataUrl} alt="User uploaded image" layout="fill" objectFit="contain" data-ai-hint="abstract photography" />
        </div>

        <div>
          <Label htmlFor="image-description" className="text-lg font-body mb-2 block">
            Image Description:
          </Label>
          {isFetchingDescription ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          ) : (
            <Textarea
              id="image-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A serene beach at sunset with golden sands and gentle waves..."
              rows={5}
              className="font-body text-base"
            />
          )}
        </div>
        {onFetchDescriptionRequest && !isFetchingDescription && (
             <Button onClick={onFetchDescriptionRequest} variant="outline" className="w-full sm:w-auto" disabled={isFetchingDescription}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isFetchingDescription ? 'animate-spin' : ''}`} />
                {isFetchingDescription ? ' Regenerating...' : 'Regenerate AI Description'}
            </Button>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={handleConfirm} className="w-full sm:w-auto" disabled={isFetchingDescription}>
          <Check className="mr-2 h-4 w-4" /> Use this Description
        </Button>
        <Button onClick={handleSkip} variant="secondary" className="w-full sm:w-auto" disabled={isFetchingDescription}>
          <SkipForward className="mr-2 h-4 w-4" /> Skip & Customize Poem
        </Button>
      </CardFooter>
    </Card>
  );
}
