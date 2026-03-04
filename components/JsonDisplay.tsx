'use client';

import { useCallback, useMemo, useState } from 'react';
import { Copy, Download, Maximize2, Minimize2 } from 'lucide-react';
import { JsonView, allExpanded, collapseAllNested, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { generateCSharpClasses, generateTypeScriptInterfaces } from '@/lib/json-codegen';

interface JsonDisplayProps {
  content: string;
  theme: string;
}

const ROOT_MODEL_NAME = 'Model';

export function JsonDisplay({ content, theme }: JsonDisplayProps) {
  const [expandAllNodes, setExpandAllNodes] = useState(false);

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

  const expandNodes = (): void => setExpandAllNodes(true);
  const collapseNodes = (): void => setExpandAllNodes(false);

  const shouldExpandNode = useCallback(
    expandAllNodes ? allExpanded : collapseAllNested,
    [expandAllNodes],
  );

  const viewerThemeStyles = theme === 'light' ? { ...defaultStyles, stringValue: 'text-black' } : { ...darkStyles };

  if (parsedResult.isEmpty) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/10 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No preview yet. Paste JSON in the Input panel to see formatted output.
        </p>
      </div>
    );
  }

  if (parsedResult.error) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-red-400/40 bg-red-500/5 p-8 text-center">
        <p className="text-sm text-red-400">{parsedResult.error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-white text-slate-100 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <span className="text-xs font-medium tracking-wide opacity-75 text-black">Formatted JSON View</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={expandNodes} className="gap-2 border border-white/10 text-black">
            <Maximize2 className="h-4 w-4" />
            Expand all
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseNodes} className="gap-2 border border-white/10 text-black">
            <Minimize2 className="h-4 w-4" />
            Collapse all
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 border border-white/10 text-black">
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
          <Button variant="ghost" size="sm" onClick={copyToClipboard} className="gap-2 border border-white/10 text-black">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-5 py-4 font-mono text-sm leading-6">
        <div className="rounded-lg border border-white/10 bg-slate-300 p-4">
          <JsonView
            data={parsedResult.data as Record<string, unknown> | unknown[]}
            style={{ ...viewerThemeStyles }}
            shouldExpandNode={shouldExpandNode}
          />
        </div>
      </div>
    </div>
  );
}
