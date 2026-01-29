'use client';

import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JsonEditor } from '@/components/JsonEditor';
import { JsonDisplay } from '@/components/JsonDisplay';
import { JsonRawView } from '@/components/JsonRawView';
import { TabItem } from '@/components/TabItem';
import { ThemeSelector } from '@/components/ThemeSelector';
import { NewTabDialog } from '@/components/NewTabDialog';
import { useApp } from '@/contexts/AppContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';
import { KeyboardHelpDialog } from '@/components/KeyboardHelpDialog';

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
    : 'formatted';

  // Handle first tab creation hint
  const isEmpty = state.tabs.length === 0;

  const handleToggleViewMode = (): void => {
    if (state.activeTabId) {
      const newMode = currentViewMode === 'raw' ? 'formatted' : 'raw';
      setTabViewMode(state.activeTabId, newMode);
    }
  };

  const handleClearAll = (): void => {
    if (confirm('Are you sure? This will delete all tabs.')) {
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
      key: 'n',
      ctrlKey: true,
      callback: () => {
        // Trigger new tab dialog via ref or state
        console.log('New tab shortcut: Ctrl+N');
      },
      description: 'Create new tab',
    },
    {
      key: 't',
      ctrlKey: true,
      callback: handleToggleViewMode,
      description: 'Toggle raw/formatted view',
    },
  ]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900/50 backdrop-blur-sm p-4 shadow-sm animate-slideDown">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
              <span className="text-sm font-bold text-white">
                {'{}'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                JSON Viewer
              </h1>
              <p className="text-xs text-muted-foreground">
                Multi-tab JSON viewer with themes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSelector
              value={state.settings.theme}
              onChange={setTheme}
            />
            <KeyboardHelpDialog />
            <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-format">
                      Auto-format on paste
                    </Label>
                    <Switch id="auto-format" disabled />
                  </div>

                  {!isEmpty && (
                    <div className="pt-2 border-t">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearAll}
                        className="w-full gap-2 justify-center"
                      >
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
      </header>

      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center animate-fadeIn">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-300">
              <span className="text-4xl">
                {'{}'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                No tabs yet
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first tab to start viewing JSON
              </p>
              <NewTabDialog onCreateTab={addTab} />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs Navigation */}
          <div className="border-b bg-muted/30 flex items-center gap-2 p-2 overflow-x-auto">
            <div className="flex gap-1 flex-1">
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
            <div className="flex gap-2 flex-shrink-0 pl-2 border-l">
              <NewTabDialog onCreateTab={addTab} />
            </div>
          </div>

          {/* Main Content */}
          {activeTab && (
            <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
              {/* Editor Section */}
              <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    {currentViewMode === 'raw' ? 'Editor' : 'Formatted'}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleViewMode}
                  >
                    {currentViewMode === 'raw'
                      ? 'View Formatted'
                      : 'View Raw'}
                  </Button>
                </div>

                {currentViewMode === 'raw' ? (
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
              </div>

              {/* Display Section */}
              <div className="flex-1 flex flex-col border-t md:border-t-0 md:border-l p-4 overflow-hidden">
                <h3 className="font-semibold mb-4">
                  Preview
                </h3>
                <JsonDisplay
                  content={activeTab.content}
                  theme={state.settings.theme}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
