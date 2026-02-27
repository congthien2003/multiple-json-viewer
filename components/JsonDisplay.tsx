'use client';

import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  generateCSharpClasses,
  generateTypeScriptInterfaces,
} from '@/lib/json-codegen';

interface JsonDisplayProps {
  content: string;
  theme: string;
}

interface ThemeColors {
  bg: string;
  text: string;
  bracket: string;
  key: string;
  string: string;
  number: string;
  boolean: string;
}

const ROOT_PATH = 'root';
const INDENT_SIZE = 18;
const ROOT_MODEL_NAME = 'Model';

export function JsonDisplay({ content, theme }: JsonDisplayProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set([ROOT_PATH]));

  const parsedResult = useMemo(() => {
    if (!content.trim()) {
      return { data: null as unknown, error: null as string | null, isEmpty: true };
    }

    try {
      return {
        data: JSON.parse(content) as unknown,
        error: null as string | null,
        isEmpty: false,
      };
    } catch {
      return {
        data: null as unknown,
        error: 'Invalid JSON. Please check commas, brackets, and key/value pairs.',
        isEmpty: false,
      };
    }
  }, [content]);

  const allExpandablePaths = useMemo(() => {
    const { data } = parsedResult;

    if (!data || typeof data !== 'object') {
      return [ROOT_PATH];
    }

    const paths: string[] = [];

    const collect = (value: unknown, path: string): void => {
      if (!value || typeof value !== 'object') return;

      paths.push(path);

      if (Array.isArray(value)) {
        value.forEach((item, index) => collect(item, `${path}[${index}]`));
        return;
      }

      Object.keys(value as Record<string, unknown>).forEach((key) => {
        collect((value as Record<string, unknown>)[key], `${path}.${key}`);
      });
    };

    collect(data, ROOT_PATH);
    return paths;
  }, [parsedResult]);

  const copyToClipboard = async (): Promise<void> => {
    if (!content.trim()) return;

    await navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!', { duration: 2000 });
  };

  const copyExport = async (format: 'csharp' | 'typescript'): Promise<void> => {
    if (parsedResult.isEmpty || parsedResult.error || parsedResult.data === null) {
      toast.error('Cannot export. Please provide valid JSON first.', { duration: 2500 });
      return;
    }

    try {
      const generated =
        format === 'csharp'
          ? generateCSharpClasses(parsedResult.data, ROOT_MODEL_NAME)
          : generateTypeScriptInterfaces(parsedResult.data, ROOT_MODEL_NAME);

      await navigator.clipboard.writeText(generated);
      toast.success(
        format === 'csharp'
          ? 'C# model copied to clipboard.'
          : 'TypeScript interface copied to clipboard.',
        { duration: 2500 },
      );
    } catch {
      toast.error('Failed to export model. Please try with another JSON shape.', { duration: 3000 });
    }
  };

  const toggleExpanded = (key: string): void => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = (): void => setExpandedKeys(new Set(allExpandablePaths));
  const collapseAll = (): void => setExpandedKeys(new Set([ROOT_PATH]));

  const getThemeColors = (): ThemeColors => {
    const themes: Record<string, ThemeColors> = {
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

  const renderValue = (value: unknown, keyPath: string, level: number): React.ReactNode => {
    const themeColors = getThemeColors();
    const paddingLeft = `${level * INDENT_SIZE}px`;

    if (value === null || value === undefined) {
      return <span className={themeColors.boolean}>null</span>;
    }

    if (typeof value === 'boolean') {
      return <span className={themeColors.boolean}>{value.toString()}</span>;
    }

    if (typeof value === 'number') {
      return <span className={themeColors.number}>{value}</span>;
    }

    if (typeof value === 'string') {
      return <span className={themeColors.string}>&quot;{value}&quot;</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedKeys.has(keyPath);
      const isEmpty = value.length === 0;

      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleExpanded(keyPath)}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:bg-white/10"
          >
            {!isEmpty &&
              (isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />)}
            <span className={themeColors.bracket}>[</span>
            {!isEmpty && !isExpanded && (
              <span className={`${themeColors.text} text-xs opacity-70`}>
                {value.length} item{value.length !== 1 ? 's' : ''}
              </span>
            )}
            {!isEmpty && !isExpanded && <span className={themeColors.bracket}>…]</span>}
            {isEmpty && <span className={themeColors.bracket}>]</span>}
          </button>

          {isExpanded && !isEmpty && (
            <div className="space-y-1">
              {value.map((item, index) => (
                <div key={index} style={{ paddingLeft }} className="leading-6">
                  {renderValue(item, `${keyPath}[${index}]`, level + 1)}
                  {index < value.length - 1 && <span className={themeColors.bracket}>,</span>}
                </div>
              ))}
              <div style={{ paddingLeft }}>
                <span className={themeColors.bracket}>]</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const isExpanded = expandedKeys.has(keyPath);
      const keys = Object.keys(value as Record<string, unknown>);
      const isEmpty = keys.length === 0;

      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleExpanded(keyPath)}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:bg-white/10"
          >
            {!isEmpty &&
              (isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />)}
            <span className={themeColors.bracket}>{'{'}</span>
            {!isEmpty && !isExpanded && (
              <span className={`${themeColors.text} text-xs opacity-70`}>
                {keys.length} key{keys.length !== 1 ? 's' : ''}
              </span>
            )}
            {!isEmpty && !isExpanded && <span className={themeColors.bracket}>{'…}'}</span>}
            {isEmpty && <span className={themeColors.bracket}>{'}'}</span>}
          </button>

          {isExpanded && !isEmpty && (
            <div className="space-y-1">
              {keys.map((key, index) => (
                <div key={key} style={{ paddingLeft }} className="font-mono text-sm leading-6">
                  <span className={themeColors.key}>&quot;{key}&quot;</span>
                  <span className={themeColors.bracket}>: </span>
                  {renderValue((value as Record<string, unknown>)[key], `${keyPath}.${key}`, level + 1)}
                  {index < keys.length - 1 && <span className={themeColors.bracket}>,</span>}
                </div>
              ))}
              <div style={{ paddingLeft }}>
                <span className={themeColors.bracket}>{'}'}</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const themeColors = getThemeColors();

  if (parsedResult.isEmpty) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/10 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No preview yet. Paste JSON in the Input panel to see formatted output.
        </p>
      </div>
    );
  }

  if (parsedResult.error) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-red-400/40 bg-red-500/5 p-6 text-center">
        <p className="text-sm text-red-400">{parsedResult.error}</p>
      </div>
    );
  }

  return (
    <div
      className={`animate-fadeIn flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 ${themeColors.bg} ${themeColors.text}`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-xs font-medium tracking-wide opacity-70">Formatted JSON View</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={expandAll} className="gap-2 border border-white/10">
            <Maximize2 className="h-4 w-4" />
            Expand all
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll} className="gap-2 border border-white/10">
            <Minimize2 className="h-4 w-4" />
            Collapse all
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 border border-white/10">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem onClick={() => copyExport('csharp')}>Export C# Class (Model)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyExport('typescript')}>
                Export TypeScript Interface (Model)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" onClick={copyToClipboard} className="gap-2 border border-white/10">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-4 py-3">
        <div className="space-y-1 font-medium text-sm leading-6">{renderValue(parsedResult.data, ROOT_PATH, 0)}</div>
      </div>
    </div>
  );
}
