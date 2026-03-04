"use client";

import React from "react";
import { Palette } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeType } from "@/types";

const THEMES: { value: ThemeType; label: string; preview: string }[] = [
  {
    value: "light",
    label: "Light (Default)",
    preview: "bg-white border border-gray-300",
  },
  {
    value: "dark",
    label: "Dark",
    preview: "bg-slate-800 border border-gray-600",
  },
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
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {THEMES.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${theme.preview}`} />
                {theme.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
