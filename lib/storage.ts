import { AppState, AppSettings, JsonTab, TabViewState } from '@/types';

const STORAGE_KEYS = {
  APP_STATE: 'json_viewer_app_state',
  TABS: 'json_viewer_tabs',
  SETTINGS: 'json_viewer_settings',
  TAB_VIEWS: 'json_viewer_tab_views',
  ACTIVE_TAB: 'json_viewer_active_tab',
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  defaultView: 'formatted',
};

export const StorageService = {
  // AppState operations
  saveAppState: (state: AppState): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
      }
    } catch (error) {
      console.error('Error saving app state:', error);
    }
  },

  loadAppState: (): AppState | null => {
    try {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEYS.APP_STATE);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error('Error loading app state:', error);
    }
    return null;
  },

  // Tab operations
  saveTabs: (tabs: JsonTab[]): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs));
      }
    } catch (error) {
      console.error('Error saving tabs:', error);
    }
  },

  loadTabs: (): JsonTab[] => {
    try {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEYS.TABS);
        return data ? JSON.parse(data) : [];
      }
    } catch (error) {
      console.error('Error loading tabs:', error);
    }
    return [];
  },

  // Settings operations
  saveSettings: (settings: AppSettings): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  loadSettings: (): AppSettings => {
    try {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : DEFAULT_SETTINGS;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return DEFAULT_SETTINGS;
  },

  // Tab view mode operations
  saveTabViews: (views: TabViewState): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TAB_VIEWS, JSON.stringify(views));
      }
    } catch (error) {
      console.error('Error saving tab views:', error);
    }
  },

  loadTabViews: (): TabViewState => {
    try {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEYS.TAB_VIEWS);
        return data ? JSON.parse(data) : {};
      }
    } catch (error) {
      console.error('Error loading tab views:', error);
    }
    return {};
  },

  // Active tab operations
  saveActiveTab: (tabId: string | null): void => {
    try {
      if (typeof window !== 'undefined') {
        if (tabId) {
          localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tabId);
        } else {
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB);
        }
      }
    } catch (error) {
      console.error('Error saving active tab:', error);
    }
  },

  loadActiveTab: (): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
      }
    } catch (error) {
      console.error('Error loading active tab:', error);
    }
    return null;
  },

  // Clear all data
  clearAll: (): void => {
    try {
      if (typeof window !== 'undefined') {
        Object.values(STORAGE_KEYS).forEach((key) => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
