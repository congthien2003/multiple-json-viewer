"use client";

import { useCallback, useMemo, useState } from "react";
import { Copy, Download } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	generateCSharpClasses,
	generateTypeScriptInterfaces,
	generateJavaClasses,
	generatePythonModels,
	generateGoStructs,
	generateKotlinDataClasses,
	generateDartClasses,
} from "@/lib/json-codegen";
import type { ThemeType } from "@/types";
import { cn } from "@/lib/utils";
import { JsonChartPanel } from "@/components/JsonChartPanel";
import { JsonSizeHeatmap } from "@/components/JsonSizeHeatmap";
import { ShareButton } from "@/components/ShareButton";
import {
	TypescriptIcon,
	CSharpIcon,
	JavaIcon,
	PythonIcon,
	GoIcon,
	KotlinIcon,
	DartIcon,
} from "@/components/LanguageIcons";

interface JsonDisplayProps {
	content: string;
	theme: ThemeType;
}

const ROOT_MODEL_NAME = "Model";

export function JsonDisplay({ content, theme }: JsonDisplayProps) {
	const [exportPreview, setExportPreview] = useState<{
		code: string;
		title: string;
		language: string;
	} | null>(null);
	const parsedResult = useMemo(() => {
		if (!content.trim()) {
			return {
				data: null as unknown,
				error: null as string | null,
				isEmpty: true,
			};
		}

		try {
			return {
				data: JSON.parse(content) as unknown,
				error: null as string | null,
				isEmpty: false,
			};
		} catch {
			return {
				data: null as unknown,
				error: "Invalid JSON. Please check commas, brackets, and key/value pairs.",
				isEmpty: false,
			};
		}
	}, [content]);

	const copyToClipboard = async (): Promise<void> => {
		if (!content.trim()) return;

		await navigator.clipboard.writeText(content);
		toast.success("Copied to clipboard!", { duration: 2000 });
	};

	const handleExportClick = (format: string): void => {
		if (
			parsedResult.isEmpty ||
			parsedResult.error ||
			parsedResult.data === null
		) {
			toast.error("Cannot export. Please provide valid JSON first.", {
				duration: 2500,
			});
			return;
		}

		const generators: Record<string, (v: unknown, n: string) => string> = {
			csharp: generateCSharpClasses,
			typescript: generateTypeScriptInterfaces,
			java: generateJavaClasses,
			python: generatePythonModels,
			go: generateGoStructs,
			kotlin: generateKotlinDataClasses,
			dart: generateDartClasses,
		};

		const labels: Record<string, string> = {
			csharp: "C# model",
			typescript: "TypeScript interface",
			java: "Java class",
			python: "Python model",
			go: "Go struct",
			kotlin: "Kotlin data class",
			dart: "Dart class",
		};

		const langs: Record<string, string> = {
			csharp: "csharp",
			typescript: "typescript",
			java: "java",
			python: "python",
			go: "go",
			kotlin: "kotlin",
			dart: "dart",
		};

		try {
			const gen = generators[format];
			if (!gen) return;
			const generated = gen(parsedResult.data, ROOT_MODEL_NAME);

			// Open preview modal instead of direct copy
			setExportPreview({
				code: generated,
				title: labels[format],
				language: langs[format] || "javascript",
			});
		} catch {
			toast.error(
				"Failed to generate model. Please try with another JSON shape.",
				{ duration: 3000 },
			);
		}
	};

	const confirmExportCopy = async (): Promise<void> => {
		if (!exportPreview) return;
		await navigator.clipboard.writeText(exportPreview.code);
		toast.success(`${exportPreview.title} copied to clipboard.`, {
			duration: 2500,
		});
		setExportPreview(null);
	};

	const formattedJsonString = parsedResult.data
		? JSON.stringify(parsedResult.data, null, 2)
		: "";

	if (parsedResult.isEmpty) {
		return (
			<div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/10 p-8 text-center">
				<p className="text-sm text-muted-foreground">
					No preview yet. Paste JSON in the Input panel to see
					formatted output.
				</p>
			</div>
		);
	}

	if (parsedResult.error) {
		return (
			<div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-red-400/40 bg-red-500/5 p-8 text-center">
				<p className="text-sm text-red-400">{parsedResult.error}</p>
			</div>
		);
	}

	return (
		<div
			// Universal semantic theme styling
			className={cn(
				"animate-fadeIn flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm backdrop-blur-sm transition-colors duration-300",
			)}>
			<div
				className={cn(
					"flex flex-none flex-wrap items-center justify-between gap-2 border-b px-4 py-2 bg-transparent text-muted-foreground",
				)}>
				<span className="text-xs font-medium tracking-wide opacity-75">
					Formatted JSON View
				</span>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="gap-2 border">
								<Download className="h-4 w-4" />
								Export
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuItem
								className="gap-2 cursor-pointer"
								onClick={() => handleExportClick("typescript")}>
								<TypescriptIcon className="h-4 w-4" />
								<span>TypeScript Interface</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="gap-2 cursor-pointer"
								onClick={() => handleExportClick("csharp")}>
								<CSharpIcon className="h-4 w-4" />
								<span>C# Class</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="gap-2 cursor-pointer"
								onClick={() => handleExportClick("java")}>
								<JavaIcon className="h-4 w-4" />
								<span>Java POJO</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="gap-2 cursor-pointer"
								onClick={() => handleExportClick("python")}>
								<PythonIcon className="h-4 w-4" />
								<span>Python Pydantic</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="gap-2 cursor-pointer"
								onClick={() => handleExportClick("go")}>
								<GoIcon className="h-4 w-4" />
								<span>Go Struct</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="gap-2 cursor-pointer"
								onClick={() => handleExportClick("kotlin")}>
								<KotlinIcon className="h-4 w-4" />
								<span>Kotlin Data Class</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="gap-2 cursor-pointer"
								onClick={() => handleExportClick("dart")}>
								<DartIcon className="h-4 w-4" />
								<span>Dart Class</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<JsonChartPanel data={parsedResult.data} />
					<JsonSizeHeatmap data={parsedResult.data} />
					<ShareButton content={content} />
					<Button
						variant="ghost"
						size="sm"
						onClick={copyToClipboard}
						className="gap-2 border">
						<Copy className="h-4 w-4" />
						Copy
					</Button>
				</div>
			</div>

			<div className="min-h-0 flex-1 overflow-hidden">
				<CodeMirror
					value={formattedJsonString}
					height="100%"
					extensions={[json()]}
					theme={theme === "light" ? "light" : "dark"}
					className="h-full text-sm font-mono [&>.cm-editor]:h-full"
					readOnly={true}
					editable={false}
					basicSetup={{
						lineNumbers: true,
						foldGutter: true,
						highlightActiveLine: false,
						highlightActiveLineGutter: false,
					}}
				/>
			</div>

			<Dialog
				open={!!exportPreview}
				onOpenChange={(open) => !open && setExportPreview(null)}>
				<DialogContent className="!sm:max-w-xl !max-w-5xl max-h-[85vh] flex flex-col">
					<DialogHeader>
						<DialogTitle>
							Export Preview: {exportPreview?.title}
						</DialogTitle>
					</DialogHeader>

					<div className="flex-1 min-h-0 overflow-scroll rounded-md border">
						{exportPreview && (
							<CodeMirror
								value={exportPreview.code}
								height="100%"
								theme={theme === "light" ? "light" : "dark"}
								className="h-full text-sm font-mono [&>.cm-editor]:h-full"
								readOnly={true}
								editable={false}
								basicSetup={{
									lineNumbers: true,
									highlightActiveLine: false,
								}}
							/>
						)}
					</div>

					<DialogFooter>
						<div className="flex gap-2 w-full justify-end">
							<Button
								variant="outline"
								onClick={() => setExportPreview(null)}>
								Close
							</Button>
							<Button
								onClick={confirmExportCopy}
								className="gap-2">
								<Copy className="h-4 w-4" />
								Copy to Clipboard
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
