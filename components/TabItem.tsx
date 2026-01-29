"use client";

import React from "react";
import { X, Copy, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { JsonTab } from "@/types";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 group relative",
        "tab-glass",
        isActive && "active",
      )}>
      <div className="flex-1 text-left truncate relative z-10">
        <div
          className={cn(
            "text-sm font-semibold truncate transition-colors",
            isActive
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}>
          {tab.title}
        </div>
        {tab.description && (
          <div className="text-xs opacity-60 truncate">{tab.description}</div>
        )}
      </div>

      {isActive && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/20 rounded-lg transition-all"
              onClick={(e) => e.stopPropagation()}>
              ⋯
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="liquid-glass border-white/20">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="hover:bg-white/10">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive hover:bg-red-500/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </button>
  );
}
