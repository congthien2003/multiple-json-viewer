'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  AppSettings,
  AppState,
  JsonTab,
  TabViewState,
  ThemeType,
  ViewMode,
} from '@/types';
import { StorageService } from '@/lib/storage';

interface AppContextType {
  state: AppState;
  tabViewModes: TabViewState;
  addTab: (title: string, description?: string) => JsonTab;
  updateTab: (
    id: string,
    updates: Partial<Omit<JsonTab, 'id' | 'createdAt'>>
  ) => void;
  deleteTab: (id: string) => void;
  setActiveTab: (id: string | null) => void;
  duplicateTab: (id: string) => void;
  setTheme: (theme: ThemeType) => void;
  setDefaultView: (view: ViewMode) => void;
  setTabViewMode: (tabId: string, mode: ViewMode) => void;
  getTab: (id: string) => JsonTab | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = StorageService.loadAppState();
    if (saved) return saved;

    return {
      tabs: [],
      activeTabId: null,
      settings: StorageService.loadSettings(),
    };
  });

  const [tabViewModes, setTabViewModes] = useState<TabViewState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial state from localStorage
  useEffect(() => {
    const saved = StorageService.loadAppState();
    if (saved) {
      setState(saved);
    }

    const savedTabViews = StorageService.loadTabViews();
    setTabViewModes(savedTabViews);
    setIsLoaded(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      StorageService.saveAppState(state);
    }
  }, [state, isLoaded]);

  // Save tab view modes
  useEffect(() => {
    if (isLoaded) {
      StorageService.saveTabViews(tabViewModes);
    }
  }, [tabViewModes, isLoaded]);

  const addTab = (title: string, description?: string): JsonTab => {
    const newTab: JsonTab = {
      id: uuidv4(),
      title,
      description,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      tabs: [...prev.tabs, newTab],
      activeTabId: newTab.id,
    }));

    return newTab;
  };

  const updateTab = (
    id: string,
    updates: Partial<Omit<JsonTab, 'id' | 'createdAt'>>
  ): void => {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab) =>
        tab.id === id
          ? { ...tab, ...updates, updatedAt: Date.now() }
          : tab
      ),
    }));
  };

  const deleteTab = (id: string): void => {
    setState((prev) => {
      const newTabs = prev.tabs.filter((tab) => tab.id !== id);
      let newActiveTabId = prev.activeTabId;

      if (prev.activeTabId === id) {
        newActiveTabId = newTabs.length > 0 ? newTabs[0].id : null;
      }

      // Clean up tab view mode
      setTabViewModes((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      return {
        ...prev,
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    });
  };

  const setActiveTab = (id: string | null): void => {
    setState((prev) => ({
      ...prev,
      activeTabId: id,
    }));
  };

  const duplicateTab = (id: string): void => {
    const tabToDuplicate = state.tabs.find((tab) => tab.id === id);
    if (tabToDuplicate) {
      const newTab: JsonTab = {
        ...tabToDuplicate,
        id: uuidv4(),
        title: `${tabToDuplicate.title} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        tabs: [...prev.tabs, newTab],
        activeTabId: newTab.id,
      }));

      // Copy view mode
      if (tabViewModes[id]) {
        setTabViewModes((prev) => ({
          ...prev,
          [newTab.id]: tabViewModes[id],
        }));
      }
    }
  };

  const setTheme = (theme: ThemeType): void => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme },
    }));
  };

  const setDefaultView = (view: ViewMode): void => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, defaultView: view },
    }));
  };

  const setTabViewMode = (tabId: string, mode: ViewMode): void => {
    setTabViewModes((prev) => ({
      ...prev,
      [tabId]: mode,
    }));
  };

  const getTab = (id: string): JsonTab | undefined => {
    return state.tabs.find((tab) => tab.id === id);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        state,
        tabViewModes,
        addTab,
        updateTab,
        deleteTab,
        setActiveTab,
        duplicateTab,
        setTheme,
        setDefaultView,
        setTabViewMode,
        getTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
