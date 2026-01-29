export type ThemeType = 'light' | 'dark' | 'monokai' | 'dracula';
export type ViewMode = 'raw' | 'formatted';

export interface JsonTab {
  id: string;
  title: string;
  description?: string;
  content: string; // raw JSON string
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  theme: ThemeType;
  defaultView: ViewMode;
}

export interface AppState {
  tabs: JsonTab[];
  activeTabId: string | null;
  settings: AppSettings;
}

export interface TabViewState {
  [tabId: string]: ViewMode;
}
