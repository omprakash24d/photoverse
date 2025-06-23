
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, Pencil, RefreshCw } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface ImageDescriptionFormProps {
  imageDataUrl: string; // Should always be present if this form is shown
  initialDescription: string;
  isFetchingDescription: boolean;
  onDescriptionConfirm: (description: string) => void;
  onSkip: () => void; // User wants to write their own description
  onFetchDescriptionRequest?: () => void; 
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
    // Update local description if initialDescription changes (e.g., after AI fetch)
    // but only if not currently fetching, to avoid overwriting user edits during a fetch.
    if (!isFetchingDescription) {
      setDescription(initialDescription);
    }
  }, [initialDescription, isFetchingDescription]);

  const handleConfirm = () => {
    // Use a default if description is empty, otherwise use trimmed description
    onDescriptionConfirm(description.trim() === "" ? "A beautiful scene" : description.trim());
  };
  
  const handleSkip = () => {
    onSkip(); 
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Describe Your Image</CardTitle>
        <CardDescription className="text-center font-body">
          Our AI has described your image. Review or edit it below, or choose to write your own.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border border-muted shadow-inner relative">
          <Image src={imageDataUrl} alt="User uploaded image for AI description" layout="fill" objectFit="contain" data-ai-hint="user image" />
        </div>

        <div>
          <Label htmlFor="image-description" className="text-lg font-body mb-2 block">
            AI Generated Description (Editable):
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
              aria-describedby="description-help"
            />
          )}
          <p id="description-help" className="text-xs text-muted-foreground mt-1">
            Feel free to refine this description or accept it as is.
          </p>
        </div>
        {onFetchDescriptionRequest && (
             <Button 
                onClick={onFetchDescriptionRequest} 
                variant="outline" 
                className="w-full sm:w-auto" 
                disabled={isFetchingDescription}
             >
                {isFetchingDescription ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {isFetchingDescription ? 'Regenerating...' : 'Regenerate AI Description'}
            </Button>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={handleConfirm} className="w-full sm:w-auto" disabled={isFetchingDescription || description.trim() === ""}>
          <Check className="mr-2 h-4 w-4" /> Use this Description
        </Button>
        <Button onClick={handleSkip} variant="secondary" className="w-full sm:w-auto" disabled={isFetchingDescription}>
          <Pencil className="mr-2 h-4 w-4" /> Write My Own Description
        </Button>
      </CardFooter>
    </Card>
  );
}
