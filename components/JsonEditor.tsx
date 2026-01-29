'use client';

import React, { useRef, useEffect } from 'react';
import { AlertCircle, Check, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { JSONFormatter } from '@/lib/json-formatter';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFormat?: () => void;
}

export function JsonEditor({ value, onChange, onFormat }: JsonEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const validation = JSONFormatter.validateJSON(value);

  const handleFormat = (): void => {
    try {
      const formatted = JSONFormatter.formatJSON(value, 2);
      onChange(formatted);
      onFormat?.();
    } catch (error) {
      console.error('Format error:', error);
    }
  };

  const handleMinify = (): void => {
    try {
      const minified = JSONFormatter.minifyJSON(value);
      onChange(minified);
    } catch (error) {
      console.error('Minify error:', error);
    }
  };

  const stats = value ? JSONFormatter.getJSONSize(value) : { chars: 0, lines: 0, size: '0 B' };

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {validation.valid ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              Valid JSON
            </div>
          ) : value ? (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              Invalid JSON
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Paste your JSON here
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {stats.lines} lines • {stats.chars} chars • {stats.size}
        </div>
      </div>

      {!validation.valid && value && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {validation.error}
          </AlertDescription>
        </Alert>
      )}

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your JSON here or type JSON content..."
        className="flex-1 font-mono text-sm resize-none min-h-0 overflow-y-auto"
      />

      <div className="flex gap-2">
        <Button
          onClick={handleFormat}
          disabled={!validation.valid || !value}
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300"
        >
          <Wand2 className="w-4 h-4" />
          Format
        </Button>
        <Button
          onClick={handleMinify}
          disabled={!validation.valid || !value}
          variant="outline"
          size="sm"
          className="hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 bg-transparent"
        >
          Minify
        </Button>
      </div>
    </div>
  );
}
