"use client";

import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonEditor } from "@/components/JsonEditor";
import { JsonDisplay } from "@/components/JsonDisplay";
import { JsonRawView } from "@/components/JsonRawView";
import { TabItem } from "@/components/TabItem";
import { ThemeSelector } from "@/components/ThemeSelector";
import { NewTabDialog } from "@/components/NewTabDialog";
import { useApp } from "@/contexts/AppContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  GlassBackground,
  GlassHeader,
  GlassPanel,
} from "@/components/ui/glass-container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { KeyboardHelpDialog } from "@/components/KeyboardHelpDialog";

export function JsonViewer() {
  const {
    state,
    tabViewModes,
    addTab,
    updateTab,
    deleteTab,
    setActiveTab,
    duplicateTab,
    setTheme,
    setTabViewMode,
    getTab,
  } = useApp();

  const [showSettings, setShowSettings] = useState(false);
  const activeTab = state.activeTabId ? getTab(state.activeTabId) : null;
  const currentViewMode = state.activeTabId
    ? tabViewModes[state.activeTabId] || state.settings.defaultView
    : "formatted";

  // Handle first tab creation hint
  const isEmpty = state.tabs.length === 0;

  const handleToggleViewMode = (): void => {
    if (state.activeTabId) {
      const newMode = currentViewMode === "raw" ? "formatted" : "raw";
      setTabViewMode(state.activeTabId, newMode);
    }
  };

  const handleClearAll = (): void => {
    if (confirm("Are you sure? This will delete all tabs.")) {
      state.tabs.forEach((tab) => deleteTab(tab.id));
    }
  };

  useEffect(() => {
    // Auto-select first tab when it exists
    if (state.tabs.length > 0 && !state.activeTabId) {
      setActiveTab(state.tabs[0].id);
    }
  }, [state.tabs, state.activeTabId, setActiveTab]);

  // Setup keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "n",
      ctrlKey: true,
      callback: () => {
        // Trigger new tab dialog via ref or state
        console.log("New tab shortcut: Ctrl+N");
      },
      description: "Create new tab",
    },
    {
      key: "t",
      ctrlKey: true,
      callback: handleToggleViewMode,
      description: "Toggle raw/formatted view",
    },
  ]);

  return (
    <GlassBackground>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <GlassHeader className="p-4 animate-slideDown z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
                <span className="text-sm font-bold text-white">{"{}"}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  JSON Viewer
                </h1>
                <p className="text-xs text-muted-foreground">
                  Multi-tab JSON viewer with themes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeSelector value={state.settings.theme} onChange={setTheme} />
              <KeyboardHelpDialog />
              <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 liquid-glass-button border-white/20 hover:border-purple-400/50">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 liquid-glass border-white/20">
                  <div className="p-3 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-format">Auto-format on paste</Label>
                      <Switch id="auto-format" disabled />
                    </div>

                    {!isEmpty && (
                      <div className="pt-2 border-t border-white/10">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleClearAll}
                          className="w-full gap-2 justify-center">
                          <Trash2 className="w-4 h-4" />
                          Clear All Tabs
                        </Button>
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </GlassHeader>

        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center animate-fadeIn p-4">
            <div className="liquid-glass text-center space-y-6 p-8 max-w-md">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 border border-purple-400/30 flex items-center justify-center mx-auto hover:scale-110 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all duration-500">
                <span className="text-5xl bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  {"{}"}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-3">
                  No tabs yet
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Create your first tab to start viewing JSON
                </p>
                <NewTabDialog onCreateTab={addTab} />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs Navigation */}
            <div className="liquid-glass-subtle mx-4 mt-4 flex items-center gap-2 p-2 overflow-x-auto rounded-2xl">
              <div className="flex gap-2 flex-1">
                {state.tabs.map((tab) => (
                  <TabItem
                    key={tab.id}
                    tab={tab}
                    isActive={state.activeTabId === tab.id}
                    onSelect={() => setActiveTab(tab.id)}
                    onDuplicate={() => duplicateTab(tab.id)}
                    onDelete={() => deleteTab(tab.id)}
                  />
                ))}
              </div>
              <div className="flex gap-2 flex-shrink-0 pl-2 border-l border-white/10">
                <NewTabDialog onCreateTab={addTab} />
              </div>
            </div>

            {/* Main Content */}
            {activeTab && (
              <div className="flex-1 flex overflow-hidden flex-col md:flex-row gap-4 p-4">
                {/* Editor Section */}
                <GlassPanel className="flex-1 flex flex-col rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground/90">
                      {currentViewMode === "raw" ? "Editor" : "Formatted"}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleViewMode}
                      className="liquid-glass-button border-white/20">
                      {currentViewMode === "raw"
                        ? "View Formatted"
                        : "View Raw"}
                    </Button>
                  </div>

                  {currentViewMode === "raw" ? (
                    <JsonEditor
                      value={activeTab.content}
                      onChange={(newContent) => {
                        updateTab(activeTab.id, { content: newContent });
                      }}
                    />
                  ) : (
                    <JsonRawView
                      content={activeTab.content}
                      theme={state.settings.theme}
                    />
                  )}
                </GlassPanel>

                {/* Display Section */}
                <GlassPanel className="flex-1 flex flex-col rounded-2xl">
                  <h3 className="font-semibold mb-4 text-foreground/90">
                    Preview
                  </h3>
                  <JsonDisplay
                    content={activeTab.content}
                    theme={state.settings.theme}
                  />
                </GlassPanel>
              </div>
            )}
          </>
        )}
      </div>
    </GlassBackground>
  );
}
