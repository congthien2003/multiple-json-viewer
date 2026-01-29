"use client";

import React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface JsonRawViewProps {
  content: string;
  theme: string;
}

export function JsonRawView({ content, theme }: JsonRawViewProps) {
  const { toast } = useToast();

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        description: "Copied to clipboard!",
        duration: 2000,
      });
    });
  };

  const getThemeClasses = () => {
    const themes: Record<string, { bg: string; text: string; border: string }> =
      {
        light: {
          bg: "bg-white",
          text: "text-gray-900",
          border: "border-gray-200",
        },
        dark: {
          bg: "bg-slate-950",
          text: "text-gray-100",
          border: "border-slate-800",
        },
        monokai: {
          bg: "bg-slate-900",
          text: "text-gray-100",
          border: "border-slate-700",
        },
        dracula: {
          bg: "bg-slate-900",
          text: "text-gray-100",
          border: "border-slate-700",
        },
      };
    return themes[theme] || themes.dark;
  };

  const themeClasses = getThemeClasses();
  const lines = content.split("\n");

  return (
    <div
      className={`flex-1 ${themeClasses.bg} ${themeClasses.text} rounded-lg overflow-hidden flex flex-col border ${themeClasses.border}`}>
      <div className="flex justify-between items-center p-4 border-b">
        <span className="text-xs opacity-70">Raw JSON View</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="gap-2">
          <Copy className="w-4 h-4" />
          Copy
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        <div className="space-y-0">
          {lines.map((line, index) => (
            <div key={index} className="flex items-start">
              <span className="select-none opacity-50 pr-4 w-10 text-right flex-shrink-0">
                {index + 1}
              </span>
              <span className="break-all whitespace-pre-wrap">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
