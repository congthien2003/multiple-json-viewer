'use client';

import { useEffect } from 'react';

interface ShortcutConfig {
  key: string; // 'n', 's', 'f', etc.
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = (shortcut.ctrlKey ?? false) === (event.ctrlKey || event.metaKey);
        const shiftMatch = (shortcut.shiftKey ?? false) === event.shiftKey;

        if (keyMatch && ctrlMatch && shiftMatch) {
          event.preventDefault();
          shortcut.callback();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
