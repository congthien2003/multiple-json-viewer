'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SHORTCUTS = [
  {
    keys: ['Ctrl/Cmd', 'T'],
    description: 'Toggle between Raw and Formatted view',
  },
  {
    keys: ['Ctrl/Cmd', 'N'],
    description: 'Create a new tab',
  },
];

export function KeyboardHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Learn keyboard shortcuts to work faster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {SHORTCUTS.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-sm hover:bg-white/15 dark:hover:bg-white/8 transition-colors duration-300"
            >
              <div className="flex gap-2">
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={key}>
                    <Badge variant="secondary" className="font-mono">
                      {key}
                    </Badge>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground text-sm">
                        +
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {shortcut.description}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
