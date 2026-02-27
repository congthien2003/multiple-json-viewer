"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonEditor } from "@/components/JsonEditor";
import { JsonDisplay } from "@/components/JsonDisplay";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KeyboardHelpDialog } from "@/components/KeyboardHelpDialog";

export function JsonViewer() {
  const {
    state,
    addTab,
    updateTab,
    deleteTab,
    setActiveTab,
    duplicateTab,
    setTheme,
    getTab,
  } = useApp();

  const [showSettings, setShowSettings] = useState(false);
  const activeTab = state.activeTabId ? getTab(state.activeTabId) : null;
  const isEmpty = state.tabs.length === 0;

  const handleCreateTab = (title: string, description?: string): void => {
    addTab(title, description);
    toast.success("Tab created", { duration: 1800 });
  };

  const handleQuickTab = (): void => {
    const newTab = addTab(`Untitled ${state.tabs.length + 1}`);
    setActiveTab(newTab.id);
    toast.success("Quick tab created", { duration: 1800 });
  };

  const handleDuplicateTab = (id: string): void => {
    duplicateTab(id);
    toast.success("Tab duplicated", { duration: 1800 });
  };

  const handleDeleteTab = (id: string): void => {
    deleteTab(id);
    toast.success("Tab deleted", { duration: 1800 });
  };

  const handleClearAll = (): void => {
    if (confirm("Are you sure? This will delete all tabs.")) {
      const count = state.tabs.length;
      state.tabs.forEach((tab) => deleteTab(tab.id));
      toast.success(`Deleted ${count} tab${count > 1 ? "s" : ""}`, {
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (state.tabs.length > 0 && !state.activeTabId) {
      setActiveTab(state.tabs[0].id);
    }
  }, [state.tabs, state.activeTabId, setActiveTab]);

  useKeyboardShortcuts([
    {
      key: "n",
      ctrlKey: true,
      callback: () => {
        const newTab = addTab(`Untitled ${state.tabs.length + 1}`);
        setActiveTab(newTab.id);
        toast.success("Tab created", { duration: 1800 });
      },
      description: "Create new tab",
    },
  ]);

  return (
    <GlassBackground>
      <div className="flex h-screen flex-col">
        <GlassHeader className="z-10 animate-slideDown p-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md transition-shadow duration-200 hover:shadow-lg">
                <span className="text-sm font-bold text-white">{"{}"}</span>
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400">
                  JSON Viewer
                </h1>
                <p className="text-xs text-muted-foreground">
                  Input on the left, formatted preview on the right
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
                    className="liquid-glass-button gap-2 border-white/20 hover:border-purple-400/50"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="liquid-glass w-56 border-white/20"
                >
                  <div className="space-y-4 p-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-format">Auto-format on paste</Label>
                      <Switch id="auto-format" disabled />
                    </div>

                    {!isEmpty && (
                      <div className="border-t border-white/10 pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleClearAll}
                          className="w-full justify-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
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
          <div className="animate-fadeIn flex flex-1 items-center justify-center p-4">
            <div className="liquid-glass max-w-md space-y-6 p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-purple-400/30 bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 transition-all duration-500 hover:scale-110 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-5xl text-transparent">
                  {"{}"}
                </span>
              </div>
              <div>
                <h2 className="mb-3 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-2xl font-bold text-transparent dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400">
                  No tabs yet
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Create your first tab to start editing JSON immediately.
                </p>
                <NewTabDialog onCreateTab={handleCreateTab} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="liquid-glass-subtle mx-4 mt-4 flex items-center gap-2 overflow-x-auto rounded-2xl p-2">
              <div className="flex flex-1 gap-2">
                {state.tabs.map((tab) => (
                  <TabItem
                    key={tab.id}
                    tab={tab}
                    isActive={state.activeTabId === tab.id}
                    onSelect={() => setActiveTab(tab.id)}
                    onDuplicate={() => handleDuplicateTab(tab.id)}
                    onDelete={() => handleDeleteTab(tab.id)}
                  />
                ))}
              </div>
              <div className="flex shrink-0 gap-2 border-l border-white/10 pl-2">
                <NewTabDialog onCreateTab={handleCreateTab} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleQuickTab}
                  className="liquid-glass-button gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Quick tab
                </Button>
              </div>
            </div>

            {activeTab && (
              <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 md:flex-row">
                <GlassPanel className="json-workspace-panel flex min-h-0 flex-1 flex-col rounded-2xl">
                  <div className="mb-4 border-b border-white/10 pb-3">
                    <h3 className="font-semibold text-foreground/95">JSON Input</h3>
                    <p className="text-xs text-muted-foreground">
                      Paste or type JSON here. Preview updates in real-time.
                    </p>
                  </div>

                  <JsonEditor
                    value={activeTab.content}
                    onChange={(newContent) => {
                      updateTab(activeTab.id, { content: newContent });
                    }}
                  />
                </GlassPanel>

                <GlassPanel className="json-workspace-panel flex min-h-0 flex-1 flex-col rounded-2xl">
                  <div className="mb-4 border-b border-white/10 pb-3">
                    <h3 className="font-semibold text-foreground/95">JSON Preview</h3>
                    <p className="text-xs text-muted-foreground">
                      Explore structured JSON tree with expand and collapse controls.
                    </p>
                  </div>
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
