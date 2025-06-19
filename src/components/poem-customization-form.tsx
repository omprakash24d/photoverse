"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { PoemSettings, PoemLanguage, PoemStyle, PoemTone, LANGUAGES, STYLES, TONES } from '@/lib/types';

interface PoemCustomizationFormProps {
  initialDescription: string;
  isDescriptionEditable: boolean; // True if user skipped AI description or wants to edit
  onDescriptionChange?: (description: string) => void;
  initialSettings: PoemSettings;
  onSettingsChange: (settings: PoemSettings) => void;
  onGeneratePoem: () => void;
  isGeneratingPoem: boolean;
}

export function PoemCustomizationForm({
  initialDescription,
  isDescriptionEditable,
  onDescriptionChange,
  initialSettings,
  onSettingsChange,
  onGeneratePoem,
  isGeneratingPoem,
}: PoemCustomizationFormProps) {
  const [description, setDescription] = useState(initialDescription);
  const [settings, setSettings] = useState<PoemSettings>(initialSettings);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);
  
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSettingChange = (field: keyof PoemSettings, value: string) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleDescriptionUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (onDescriptionChange) {
      onDescriptionChange(e.target.value);
    }
  };
  
  const handleSubmit = () => {
    if(description.trim() === "") {
      // Potentially show a toast error or inline message
      alert("Please provide an image description.");
      return;
    }
    onGeneratePoem();
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Customize Your Poem</CardTitle>
        <CardDescription className="text-center font-body">
          {isDescriptionEditable ? "Describe your image, then " : "Review the description and "}
          choose the language, style, and tone for your AI-generated poem.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isDescriptionEditable && (
          <div className="space-y-2">
            <Label htmlFor="custom-description" className="text-lg font-body">Image Description:</Label>
            <Textarea
              id="custom-description"
              value={description}
              onChange={handleDescriptionUpdate}
              placeholder="Describe the image for the poem..."
              rows={4}
              className="font-body text-base"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="poem-language" className="font-body">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSettingChange('language', value as PoemLanguage)}
            >
              <SelectTrigger id="poem-language" className="font-body">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang} value={lang} className="font-body">{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="poem-style" className="font-body">Style</Label>
            <Select
              value={settings.style}
              onValueChange={(value) => handleSettingChange('style', value as PoemStyle)}
            >
              <SelectTrigger id="poem-style" className="font-body">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map(style => (
                  <SelectItem key={style} value={style} className="font-body">{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="poem-tone" className="font-body">Tone</Label>
            <Select
              value={settings.tone}
              onValueChange={(value) => handleSettingChange('tone', value as PoemTone)}
            >
              <SelectTrigger id="poem-tone" className="font-body">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {TONES.map(tone => (
                  <SelectItem key={tone} value={tone} className="font-body">{tone}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleSubmit} disabled={isGeneratingPoem || description.trim() === ""} size="lg">
          {isGeneratingPoem ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          Generate Poem
        </Button>
      </CardFooter>
    </Card>
  );
}
