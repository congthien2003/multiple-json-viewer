'use client';

import React, { useState } from 'react';
import { Copy, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { JSONFormatter } from '@/lib/json-formatter';

interface JsonDisplayProps {
  content: string;
  theme: string;
}

interface JsonNode {
  key: string | number;
  value: unknown;
  level: number;
  type: 'array' | 'object' | 'string' | 'number' | 'boolean' | 'null';
}

export function JsonDisplay({ content, theme }: JsonDisplayProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const parseContent = (): unknown => {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  };

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        description: 'Copied to clipboard!',
        duration: 2000,
      });
    });
  };

  const toggleExpanded = (key: string): void => {
    const newSet = new Set(expandedKeys);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setExpandedKeys(newSet);
  };

  const getThemeColors = () => {
    const themes: Record<
      string,
      { bg: string; text: string; bracket: string; key: string; string: string; number: string; boolean: string }
    > = {
      light: {
        bg: 'bg-white',
        text: 'text-gray-800',
        bracket: 'text-gray-500',
        key: 'text-blue-600',
        string: 'text-green-700',
        number: 'text-orange-600',
        boolean: 'text-red-600',
      },
      dark: {
        bg: 'bg-slate-950',
        text: 'text-gray-100',
        bracket: 'text-gray-500',
        key: 'text-blue-400',
        string: 'text-green-400',
        number: 'text-orange-400',
        boolean: 'text-red-400',
      },
      monokai: {
        bg: 'bg-slate-900',
        text: 'text-gray-200',
        bracket: 'text-gray-500',
        key: 'text-pink-400',
        string: 'text-green-400',
        number: 'text-purple-400',
        boolean: 'text-pink-400',
      },
      dracula: {
        bg: 'bg-slate-900',
        text: 'text-gray-100',
        bracket: 'text-gray-600',
        key: 'text-blue-300',
        string: 'text-green-300',
        number: 'text-purple-300',
        boolean: 'text-pink-300',
      },
    };
    return themes[theme] || themes.dark;
  };

  const renderValue = (
    value: unknown,
    keyPath: string,
    level: number
  ): React.ReactNode => {
    const themeColors = getThemeColors();
    const padding = level * 16;

    if (
      value === null ||
      value === undefined
    ) {
      return (
        <span className={themeColors.boolean}>
          null
        </span>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <span className={themeColors.boolean}>
          {value.toString()}
        </span>
      );
    }

    if (typeof value === 'number') {
      return (
        <span className={themeColors.number}>
          {value}
        </span>
      );
    }

    if (typeof value === 'string') {
      return (
        <span className={themeColors.string}>
          &quot;{value}&quot;
        </span>
      );
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedKeys.has(keyPath);
      const isEmpty = value.length === 0;

      return (
        <div>
          <button
            onClick={() => toggleExpanded(keyPath)}
            className="inline-flex items-center gap-1 hover:bg-gray-200/10 rounded px-1"
          >
            {!isEmpty && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            )}
            <span className={themeColors.bracket}>
              [
            </span>
            {!isEmpty && !isExpanded && (
              <span className={`${themeColors.text} text-xs opacity-70`}>
                {value.length} item{value.length !== 1 ? 's' : ''}
              </span>
            )}
            {!isEmpty && !isExpanded && (
              <span className={themeColors.bracket}>
                …
              </span>
            )}
          </button>
          {isExpanded && !isEmpty && (
            <div>
              {value.map((item, index) => (
                <div
                  key={index}
                  style={{ paddingLeft: `${padding}px` }}
                >
                  <span className={themeColors.bracket}>
                    {renderValue(item, `${keyPath}[${index}]`, level + 1)}
                  </span>
                  {index < value.length - 1 && (
                    <span className={themeColors.bracket}>
                      ,
                    </span>
                  )}
                </div>
              ))}
              <span
                style={{ paddingLeft: `${padding - 16}px` }}
                className={themeColors.bracket}
              >
                ]
              </span>
            </div>
          )}
          {isEmpty && (
            <span className={themeColors.bracket}>
              ]
            </span>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const isExpanded = expandedKeys.has(keyPath);
      const keys = Object.keys(value);
      const isEmpty = keys.length === 0;

      return (
        <div>
          <button
            onClick={() => toggleExpanded(keyPath)}
            className="inline-flex items-center gap-1 hover:bg-gray-200/10 rounded px-1"
          >
            {!isEmpty && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            )}
            <span className={themeColors.bracket}>
              {'{'}
            </span>
            {!isEmpty && !isExpanded && (
              <span className={`${themeColors.text} text-xs opacity-70`}>
                {keys.length} key{keys.length !== 1 ? 's' : ''}
              </span>
            )}
            {!isEmpty && !isExpanded && (
              <span className={themeColors.bracket}>
                …
              </span>
            )}
          </button>
          {isExpanded && !isEmpty && (
            <div>
              {keys.map((key, index) => (
                <div
                  key={key}
                  style={{ paddingLeft: `${padding}px` }}
                  className="font-mono text-sm"
                >
                  <span className={themeColors.key}>
                    &quot;{key}&quot;
                  </span>
                  <span className={themeColors.bracket}>
                    :
                  </span>
                  {' '}
                  {renderValue(
                    (value as Record<string, unknown>)[key],
                    `${keyPath}.${key}`,
                    level + 1
                  )}
                  {index < keys.length - 1 && (
                    <span className={themeColors.bracket}>
                      ,
                    </span>
                  )}
                </div>
              ))}
              <span
                style={{ paddingLeft: `${padding - 16}px` }}
                className={themeColors.bracket}
              >
                {'}'}
              </span>
            </div>
          )}
          {isEmpty && (
            <span className={themeColors.bracket}>
              {'}'}
            </span>
          )}
        </div>
      );
    }

    return null;
  };

  const data = parseContent();
  const themeColors = getThemeColors();

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Invalid JSON format
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 ${themeColors.bg} ${themeColors.text} p-4 rounded-lg overflow-auto font-mono text-sm animate-fadeIn`}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs opacity-70">
          Formatted JSON View
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="gap-2 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors duration-300"
        >
          <Copy className="w-4 h-4" />
          Copy
        </Button>
      </div>
      <div className="space-y-0">
        {renderValue(data, 'root', 0)}
      </div>
    </div>
  );
}
