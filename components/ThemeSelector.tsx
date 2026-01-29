'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeType } from '@/types';

const THEMES: { value: ThemeType; label: string; preview: string }[] = [
  { value: 'light', label: 'Light', preview: 'bg-white border-2 border-gray-200' },
  { value: 'dark', label: 'Dark', preview: 'bg-slate-950 border-2 border-slate-700' },
  { value: 'monokai', label: 'Monokai', preview: 'bg-slate-900 border-2 border-pink-500' },
  { value: 'dracula', label: 'Dracula', preview: 'bg-slate-900 border-2 border-blue-400' },
];

interface ThemeSelectorProps {
  value: ThemeType;
  onChange: (theme: ThemeType) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Palette className="w-4 h-4 text-muted-foreground animate-fadeIn" />
      <Select value={value} onValueChange={(v) => onChange(v as ThemeType)}>
        <SelectTrigger className="w-40 hover:border-blue-400 transition-colors duration-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {THEMES.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${theme.preview}`} />
                {theme.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
