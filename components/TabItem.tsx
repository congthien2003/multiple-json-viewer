'use client';

import React from 'react';
import { X, Copy, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { JsonTab } from '@/types';

interface TabItemProps {
  tab: JsonTab;
  isActive: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function TabItem({
  tab,
  isActive,
  onSelect,
  onDuplicate,
  onDelete,
}: TabItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all duration-300 group relative overflow-hidden ${
        isActive
          ? 'bg-white dark:bg-slate-800/50 border-blue-500 text-foreground shadow-sm animate-slideUp'
          : 'bg-muted border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:border-blue-300'
      }`}
    >
      <div className="flex-1 text-left truncate">
        <div className="text-sm font-semibold truncate">
          {tab.title}
        </div>
        {tab.description && (
          <div className="text-xs opacity-70 truncate">
            {tab.description}
          </div>
        )}
      </div>

      {isActive && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              ⋯
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </button>
  );
}
