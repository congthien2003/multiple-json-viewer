import { AppState, AppSettings, JsonTab }from '@/types';

const STORAGE_KEYS = {
  APP_STATE: 'json_viewer_app_state',
  TABS: 'json_viewer_tabs',
  SETTINGS: 'json_viewer_settings',
  ACTIVE_TAB: 'json_viewer_active_tab',
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
};

export const StorageService = {
  saveAppState: (state: AppState): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
      }
    }catch (error) {
      console.error('Error saving app state:', error);
    }
  },

  loadAppState: (): AppState | null => {
    try {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEYS.APP_STATE);
        return data ? JSON.parse(data) : null;
      }
    }catch (error) {
      console.error('Error loading app state:', error);
    }
    return null;
  },

  saveTabs: (tabs: JsonTab[]): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs));
      }
    }catch (error) {
      console.error('Error saving tabs:', error);
    }
  },

  loadTabs: (): JsonTab[] => {
    try {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEYS.TABS);
        return data ? JSON.parse(data) : [];
      }
    }catch (error) {
      console.error('Error loading tabs:', error);
    }
    return [];
  },

  saveSettings: (settings: AppSettings): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      }
    }catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  loadSettings: (): AppSettings => {
    try {
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : DEFAULT_SETTINGS;
      }
    }catch (error) {
      console.error('Error loading settings:', error);
    }
    return DEFAULT_SETTINGS;
  },

  saveActiveTab: (tabId: string | null): void => {
    try {
      if (typeof window !== 'undefined') {
        if (tabId) {
          localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tabId);
        }else {
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB);
        }
      }
    }catch (error) {
      console.error('Error saving active tab:', error);
    }
  },

  loadActiveTab: (): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
      }
    }catch (error) {
      console.error('Error loading active tab:', error);
    }
    return null;
  },

  clearAll: (): void => {
    try {
      if (typeof window !== 'undefined') {
        Object.values(STORAGE_KEYS).forEach((key) => {
          localStorage.removeItem(key);
        });
      }
    }catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
