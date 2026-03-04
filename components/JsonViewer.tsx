"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Settings, Trash2, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonEditor } from "@/components/JsonEditor";
import { JsonDisplay } from "@/components/JsonDisplay";
import { JsonPathQuery } from "@/components/JsonPathQuery";
import { JsonDiffViewer } from "@/components/JsonDiffViewer";
import { DiffTabSelector } from "@/components/DiffTabSelector";
import { TabItem } from "@/components/TabItem";
import { decompressFromUrl } from "@/lib/json-share";
import { ThemeSelector } from "@/components/ThemeSelector";
import { NewTabDialog } from "@/components/NewTabDialog";
import { useApp } from "@/contexts/AppContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
	const [jsonPathResult, setJsonPathResult] = useState<string | null>(null);
	const [compareMode, setCompareMode] = useState(false);
	const [leftTabId, setLeftTabId] = useState<string | null>(null);
	const [rightTabId, setRightTabId] = useState<string | null>(null);

	const activeTab = state.activeTabId ? getTab(state.activeTabId) : null;
	const isEmpty = state.tabs.length === 0;

	const leftTab = leftTabId ? getTab(leftTabId) : null;
	const rightTab = rightTabId ? getTab(rightTabId) : null;

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

	const toggleCompareMode = (): void => {
		if (!compareMode && state.tabs.length >= 2) {
			setLeftTabId(state.tabs[0].id);
			setRightTabId(state.tabs[1].id);
		}
		setCompareMode(!compareMode);
	};

	useEffect(() => {
		if (state.tabs.length > 0 && !state.activeTabId) {
			setActiveTab(state.tabs[0].id);
		}
	}, [state.tabs, state.activeTabId, setActiveTab]);

	const searchParams = useSearchParams();
	const hasDecoded = useRef(false);

	// Handle shared URL: decompress ?data= parameter into a new tab
	useEffect(() => {
		const dataParam = searchParams.get("data");
		if (!dataParam || hasDecoded.current) return;

		hasDecoded.current = true;

		decompressFromUrl(dataParam)
			.then((content) => {
				// Validate it's real JSON
				JSON.parse(content);
				const tab = addTab("Shared JSON");
				updateTab(tab.id, { content });
				toast.success("Shared JSON loaded!", { duration: 2500 });

				// Clean up URL without reload
				const url = new URL(window.location.href);
				url.searchParams.delete("data");
				window.history.replaceState({}, "", url.toString());
			})
			.catch(() => {
				toast.error("Failed to load shared JSON.", { duration: 3000 });
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		<div className="min-h-screen bg-background bg-gradient-to-br from-background/90 to-background">
			<div className="flex h-screen flex-col">
				<header className="z-10 animate-slideDown p-4 border-b bg-card shadow-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md transition-shadow duration-200 hover:shadow-lg">
								<span className="text-sm font-bold text-white">
									{"{}"}
								</span>
							</div>
							<div>
								<h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400">
									JSON Viewer
								</h1>
								<p className="text-xs text-muted-foreground">
									Input on the left, formatted preview on the
									right
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							{state.tabs.length >= 2 && (
								<Button
									variant={
										compareMode ? "default" : "outline"
									}
									size="sm"
									onClick={toggleCompareMode}
									className="gap-2">
									<GitCompareArrows className="h-4 w-4" />
									Compare
								</Button>
							)}
							<ThemeSelector
								value={state.settings.theme}
								onChange={setTheme}
							/>
							<KeyboardHelpDialog />
							<DropdownMenu
								open={showSettings}
								onOpenChange={setShowSettings}>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="gap-2 transition-all">
										<Settings className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-56">
									<div className="space-y-4 p-3">
										<div className="flex items-center justify-between">
											<Label htmlFor="auto-format">
												Auto-format on paste
											</Label>
											<Switch id="auto-format" disabled />
										</div>

										{!isEmpty && (
											<div className="border-t border-white/10 pt-2">
												<Button
													variant="destructive"
													size="sm"
													onClick={handleClearAll}
													className="w-full justify-center gap-2">
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
				</header>

				{isEmpty ? (
					<div className="animate-fadeIn flex flex-1 items-center justify-center p-4">
						<div className="rounded-2xl border bg-card max-w-md shadow-sm space-y-6 p-8 text-center">
							<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 transition-all duration-500 hover:scale-110 hover:shadow-md">
								<span className="text-5xl text-primary font-bold">
									{"{}"}
								</span>
							</div>
							<div>
								<h2 className="mb-3 text-foreground text-2xl font-bold">
									No tabs yet
								</h2>
								<p className="mb-6 text-sm text-muted-foreground">
									Create your first tab to start editing JSON
									immediately.
								</p>
								<NewTabDialog onCreateTab={handleCreateTab} />
							</div>
						</div>
					</div>
				) : (
					<>
						{!compareMode && (
							<div className="mx-4 mt-4 flex items-center gap-2 overflow-x-auto rounded-xl border bg-card p-2 shadow-sm">
								<div className="flex flex-1 gap-2">
									{state.tabs.map((tab) => (
										<TabItem
											key={tab.id}
											tab={tab}
											isActive={
												state.activeTabId === tab.id
											}
											onSelect={() =>
												setActiveTab(tab.id)
											}
											onDuplicate={() =>
												handleDuplicateTab(tab.id)
											}
											onDelete={() =>
												handleDeleteTab(tab.id)
											}
										/>
									))}
								</div>
								<div className="flex shrink-0 gap-2 border-l border-white/10 pl-2">
									<NewTabDialog
										onCreateTab={handleCreateTab}
									/>
									<Button
										size="sm"
										variant="outline"
										onClick={handleQuickTab}
										className="gap-2">
										<Plus className="h-4 w-4" />
										Quick tab
									</Button>
								</div>
							</div>
						)}

						{compareMode ? (
							<div className="flex flex-1 flex-col overflow-hidden p-4">
								<div className="mb-4 flex items-center justify-between rounded-xl border bg-card p-3 shadow-sm">
									<DiffTabSelector
										tabs={state.tabs}
										leftTabId={leftTabId}
										rightTabId={rightTabId}
										onLeftChange={setLeftTabId}
										onRightChange={setRightTabId}
									/>
								</div>
								{leftTab && rightTab ? (
									<div className="flex min-h-0 flex-1 rounded-xl border bg-card shadow-sm overflow-hidden">
										<JsonDiffViewer
											leftContent={leftTab.content}
											rightContent={rightTab.content}
											leftLabel={leftTab.title}
											rightLabel={rightTab.title}
											theme={state.settings.theme}
										/>
									</div>
								) : (
									<div className="flex flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/30 p-8">
										<p className="text-sm text-muted-foreground">
											Select two tabs above to compare
											their JSON content.
										</p>
									</div>
								)}
							</div>
						) : (
							activeTab && (
								<div className="gap-4 overflow-hidden p-4 grid grid-cols-1 md:grid-cols-2 ">
									<div className="flex min-h-0 flex-1 flex-col rounded-xl border bg-card p-4 shadow-sm">
										<div className="mb-4 border-b border-border/40 pb-3">
											<h3 className="font-semibold text-foreground/95">
												JSON Input
											</h3>
											<p className="text-xs text-muted-foreground">
												Paste or type JSON here. Preview
												updates in real-time.
											</p>
										</div>

										<JsonEditor
											value={activeTab.content}
											onChange={(newContent) => {
												updateTab(activeTab.id, {
													content: newContent,
												});
											}}
										/>
									</div>

									<div className="flex min-h-0 flex-1 flex-col rounded-xl border bg-card p-4 shadow-sm">
										<div className="mb-3">
											<JsonPathQuery
												content={activeTab.content}
												onResult={setJsonPathResult}
											/>
										</div>
										<JsonDisplay
											content={
												jsonPathResult ??
												activeTab.content
											}
											theme={state.settings.theme}
										/>
									</div>
								</div>
							)
						)}
					</>
				)}
			</div>
		</div>
	);
}
