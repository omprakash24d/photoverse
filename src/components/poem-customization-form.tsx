
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2, RefreshCcwIcon, Shuffle, Sparkles } from 'lucide-react';
import { PoemSettings, PoemLanguage, PoemStyle, PoemTone, PoemLength, LANGUAGES, STYLES, TONES, LENGTHS } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';


interface PoemCustomizationFormProps {
  initialDescription: string;
  isDescriptionEditable: boolean;
  onDescriptionChange?: (description: string) => void;
  initialSettings: PoemSettings;
  onSettingsChange: (settings: PoemSettings) => void;
  onGeneratePoem: () => void;
  isGeneratingPoem: boolean;
  onResetSettingsRequest?: () => void;
}

export function PoemCustomizationForm({
  initialDescription,
  isDescriptionEditable,
  onDescriptionChange,
  initialSettings,
  onSettingsChange,
  onGeneratePoem,
  isGeneratingPoem,
  onResetSettingsRequest,
}: PoemCustomizationFormProps) {
  const [description, setDescription] = useState(initialDescription);
  const [settings, setSettings] = useState<PoemSettings>(initialSettings);
  const { toast } = useToast();

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);
  
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSettingChange = (field: keyof PoemSettings, value: string | undefined) => {
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
    if (!description || description.trim() === "") {
       toast({ 
          variant: "destructive", 
          title: "Missing Description", 
          description: "Please provide an image description or subject for the poem." 
      });
      return;
    }
    onGeneratePoem();
  }

  const handleResetOptions = () => {
    if (onResetSettingsRequest) {
      onResetSettingsRequest(); 
    }
  };

  const handleSurpriseMe = () => {
    const randomLanguage = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
    const randomTone = TONES[Math.floor(Math.random() * TONES.length)];
    const randomLength = LENGTHS[Math.floor(Math.random() * LENGTHS.length)];
    
    const newSettings: PoemSettings = {
      ...settings, // Preserve custom instruction and poetic devices if they exist
      language: randomLanguage,
      style: randomStyle,
      tone: randomTone,
      poemLength: randomLength,
    };
    setSettings(newSettings);
    onSettingsChange(newSettings);
    toast({
      title: "Options Randomized!",
      description: "Poem language, style, tone, and length have been shuffled.",
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Customize Your Poem</CardTitle>
        <CardDescription className="text-center font-body">
          {isDescriptionEditable ? "Describe your image or idea, then " : "Review the description and "}
          choose the options for your AI-generated poem.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isDescriptionEditable && (
          <div className="space-y-2">
            <Label htmlFor="custom-description" className="text-lg font-body">Image Description / Poem Subject:</Label>
            <Textarea
              id="custom-description"
              value={description}
              onChange={handleDescriptionUpdate}
              placeholder="Describe the image, scene, or idea for the poem..."
              rows={4}
              className="font-body text-base"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="poem-language" className="font-body">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSettingChange('language', value as PoemLanguage)}
              disabled={isGeneratingPoem}
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
              disabled={isGeneratingPoem}
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
              disabled={isGeneratingPoem}
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
          
          <div className="space-y-2">
            <Label htmlFor="poem-length" className="font-body">Poem Length</Label>
            <Select
              value={settings.poemLength}
              onValueChange={(value) => handleSettingChange('poemLength', value as PoemLength)}
              disabled={isGeneratingPoem}
            >
              <SelectTrigger id="poem-length" className="font-body">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                {LENGTHS.map(length => (
                  <SelectItem key={length} value={length} className="font-body">{length}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="custom-instruction" className="font-body">Custom Instruction (Optional)</Label>
            <Textarea
              id="custom-instruction"
              value={settings.customInstruction || ''}
              onChange={(e) => handleSettingChange('customInstruction', e.target.value)}
              placeholder="e.g., Make it rhyme, focus on the color blue, mention a specific character..."
              rows={2}
              className="font-body text-sm"
              disabled={isGeneratingPoem}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="poetic-devices" className="font-body flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Poetic Devices (Optional)
            </Label>
            <Textarea
              id="poetic-devices"
              value={settings.poeticDevices || ''}
              onChange={(e) => handleSettingChange('poeticDevices', e.target.value)}
              placeholder="e.g., Metaphor, simile, personification, alliteration..."
              rows={2}
              className="font-body text-sm"
              disabled={isGeneratingPoem}
            />
        </div>


        <div className="flex flex-col sm:flex-row gap-3 items-center justify-start">
            {onResetSettingsRequest && (
              <Button 
                onClick={handleResetOptions} 
                variant="outline" 
                className="w-full sm:w-auto"
                disabled={isGeneratingPoem}
              >
                <RefreshCcwIcon className="mr-2 h-4 w-4" /> Reset Options
              </Button>
            )}
            <Button 
                onClick={handleSurpriseMe} 
                variant="outline" 
                className="w-full sm:w-auto"
                disabled={isGeneratingPoem}
              >
                <Shuffle className="mr-2 h-4 w-4" /> Surprise Me! (Options)
              </Button>
        </div>

      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-6">
        <Button 
            onClick={handleSubmit} 
            disabled={isGeneratingPoem || !description || description.trim() === ""} 
            size="lg"
            className="w-full sm:w-auto"
        >
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
