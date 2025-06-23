"use client";

import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ProTips() {
  return (
    <Card className="mt-8 w-full bg-accent/10 border-accent/20">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
        <Lightbulb className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline text-xl text-primary">Pro-Tips for Better Poems</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 text-muted-foreground font-body">
            The more vivid your description, the more creative the AI can be. Try these tips!
        </CardDescription>
        <div className="space-y-4 text-muted-foreground font-body pl-2 text-sm">
            <div>
                <p className="font-semibold text-foreground">1. Paint a Picture with Details</p>
                <p className="pl-4 border-l-2 border-primary/30 ml-2 mt-1">
                    <strong>Instead of:</strong> "A photo of a beach."<br />
                    <strong>Try:</strong> "Crashing turquoise waves on a beach littered with smooth, grey pebbles under a stormy sky."
                </p>
            </div>
            <div>
                <p className="font-semibold text-foreground">2. Infuse Emotion and Mood</p>
                <p className="pl-4 border-l-2 border-primary/30 ml-2 mt-1">
                    <strong>Instead of:</strong> "A picture of an old house."<br />
                    <strong>Try:</strong> "A lonely, forgotten farmhouse with peeling paint, slumped under the weight of memories."
                </p>
            </div>
             <div>
                <p className="font-semibold text-foreground">3. Use All Your Senses</p>
                <p className="pl-4 border-l-2 border-primary/30 ml-2 mt-1">
                    <strong>Instead of:</strong> "A forest in autumn."<br />
                    <strong>Try:</strong> "The crisp scent of damp earth and the crunch of golden leaves underfoot in a quiet autumn forest."
                </p>
            </div>
            <div>
                <p className="font-semibold text-foreground">4. Experiment & Regenerate!</p>
                <p className="pl-4 border-l-2 border-primary/30 ml-2 mt-1">
                    Don't love the first result? Change a few words in your description or hit "Regenerate Poem". Sometimes the best creations are just a click away!
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
