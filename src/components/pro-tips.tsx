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
        <ul className="list-disc list-inside space-y-3 text-muted-foreground font-body pl-2">
            <li>
                <strong>Be Specific:</strong> Instead of "a tree," try "a lonely oak tree on a misty hill at dawn." Richer details create richer poems.
            </li>
            <li>
                <strong>Add Emotion:</strong> Mention feelings directly. "A joyful, sunny beach" will yield a very different poem than "a desolate, empty beach."
            </li>
            <li>
                <strong>Use All Senses:</strong> Go beyond just sight. What might you hear, smell, or feel? Think "the crash of waves" or "the chill of the wind."
            </li>
            <li>
                <strong>Iterate & Refine:</strong> The first poem is just a starting point. Hit "Regenerate" for a new take, or tweak your settings. Great results come from experimenting!
            </li>
        </ul>
      </CardContent>
    </Card>
  );
}
