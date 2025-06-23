
"use client";

import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProTips() {
  return (
    <Card className="mt-8 w-full bg-accent/10 border-accent/20">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
        <Lightbulb className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline text-xl text-primary">Pro-Tips for Great Poems</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground font-body pl-2">
          <li><strong>Be Specific:</strong> Instead of "a tree," try "a lonely oak tree on a misty hill at dawn."</li>
          <li><strong>Add Emotion:</strong> Mention feelings in your description, like "a joyful, sunny beach" or "a melancholic, rainy street."</li>
          <li><strong>Iterate!</strong> The best results often come after trying a few different descriptions or settings.</li>
        </ul>
      </CardContent>
    </Card>
  );
}
