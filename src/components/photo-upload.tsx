
"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Camera, Image as ImageIcon, XCircle, Edit3, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { WebcamCaptureModal } from './webcam-capture-modal';

interface PhotoUploadProps {
  onImageSelected: (file: File | string) => void;
  isLoading?: boolean;
  onSkipToDescription: () => void;
  onSurprisePoemRequest: () => void; // New prop for surprise poem
}

export function PhotoUpload({ onImageSelected, isLoading = false, onSkipToDescription, onSurprisePoemRequest }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isWebcamModalOpen, setIsWebcamModalOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelected(file);
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false,
    disabled: isLoading,
  });

  const handleClearPreview = () => {
    setPreview(null);
    setFileName(null);
  };

  const handleWebcamCapture = (dataUrl: string) => {
    setPreview(dataUrl);
    setFileName("webcam_capture.png");
    onImageSelected(dataUrl);
    setIsWebcamModalOpen(false);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Start Your Poem</CardTitle>
        <CardDescription className="text-center font-body">
          Upload a photo, use your webcam, start with words, or get a surprise poem!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {preview && !isLoading ? (
          <div className="relative group aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-dashed border-primary/50">
            <Image src={preview} alt={fileName || "Preview"} layout="fill" objectFit="contain" data-ai-hint="user preview" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handleClearPreview}
              aria-label="Remove image"
              disabled={isLoading}
            >
              <XCircle className="h-5 w-5" />
            </Button>
            <p className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {fileName}
            </p>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
              ${isLoading ? 'cursor-not-allowed opacity-70 bg-muted/30' :
                isDragActive ? 'border-accent bg-accent/10' : 'border-primary/30 hover:border-accent'}`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-16 w-16 text-primary/70 mb-4" />
            {isDragActive ? (
              <p className="font-body text-lg text-accent">Drop the image here...</p>
            ) : (
              <p className="font-body text-lg text-muted-foreground">
                Drag 'n' drop an image, or click to select
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WEBP</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button onClick={() => getRootProps().onClick?.({} as React.MouseEvent<HTMLDivElement>)} variant="outline" className="w-full sm:w-auto" disabled={isLoading}>
            <ImageIcon className="mr-2 h-4 w-4" /> Choose File
          </Button>
          <Button onClick={() => setIsWebcamModalOpen(true)} variant="outline" className="w-full sm:w-auto" disabled={isLoading}>
            <Camera className="mr-2 h-4 w-4" /> Use Webcam
          </Button>
        </div>
        {isLoading && <p className="text-center text-primary font-body">Processing your request, please wait...</p>}
      </CardContent>
      <CardFooter className="flex-col items-center justify-center pt-0 pb-6 space-y-3">
         <div className="relative flex py-2 items-center w-4/5 sm:w-2/3 mx-auto">
            <div className="flex-grow border-t border-muted-foreground/30"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">Or</span>
            <div className="flex-grow border-t border-muted-foreground/30"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <Button onClick={onSkipToDescription} variant="secondary" className="w-full sm:w-auto" disabled={isLoading}>
                <Edit3 className="mr-2 h-4 w-4" /> Write Description Manually
            </Button>
            <Button onClick={onSurprisePoemRequest} variant="default" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                <Wand2 className="mr-2 h-4 w-4" /> Surprise Me with a Poem!
            </Button>
        </div>
      </CardFooter>
      <WebcamCaptureModal
        isOpen={isWebcamModalOpen}
        onClose={() => setIsWebcamModalOpen(false)}
        onCapture={handleWebcamCapture}
      />
    </Card>
  );
}
