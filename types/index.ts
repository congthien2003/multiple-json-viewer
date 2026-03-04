export type ThemeType = "light" | "dark" | "monokai" | "dracula";

export interface JsonTab {
	id: string;
	title: string;
	description?: string;
	content: string;
	createdAt: number;
	updatedAt: number;
}

export interface AppSettings {
	theme: ThemeType;
}

export interface AppState {
	tabs: JsonTab[];
	activeTabId: string | null;
	settings: AppSettings;
}
