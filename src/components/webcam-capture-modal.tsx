
"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Check, RefreshCcw } from "lucide-react";

interface WebcamCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export function WebcamCaptureModal({ isOpen, onClose, onCapture }: WebcamCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setCapturedImage(null);
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Could not access webcam. Please ensure permissions are granted and try again.");
      }
    } else {
      setError("Webcam not supported by this browser.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    // Cleanup function to stop camera on component unmount
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera(); // Stop camera after capture
      }
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    startCamera();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[700px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Capture Photo</DialogTitle>
        </DialogHeader>
        <div className="my-4 flex flex-col items-center">
          {error && <p className="text-destructive mb-4">{error}</p>}
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" className="rounded-lg shadow-md max-w-full max-h-[480px]" data-ai-hint="webcam selfie" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className={`rounded-lg shadow-md w-full max-w-[640px] h-auto ${error ? 'hidden' : ''}`} />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <DialogFooter className="gap-2 sm:justify-center">
          {capturedImage ? (
            <>
              <Button onClick={handleRetake} variant="outline">
                <RefreshCcw className="mr-2 h-4 w-4" /> Retake
              </Button>
              <Button onClick={handleConfirm}>
                <Check className="mr-2 h-4 w-4" /> Use this Photo
              </Button>
            </>
          ) : (
            <Button onClick={handleCapture} disabled={!stream || !!error}>
              <Camera className="mr-2 h-4 w-4" /> Capture
            </Button>
          )}
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
