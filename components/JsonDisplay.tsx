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
	generateCSharpClasses,
	generateTypeScriptInterfaces,
} from "@/lib/json-codegen";
import type { ThemeType } from "@/types";
import { cn } from "@/lib/utils";

interface JsonDisplayProps {
	content: string;
	theme: ThemeType;
}

const ROOT_MODEL_NAME = "Model";

export function JsonDisplay({ content, theme }: JsonDisplayProps) {
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
				error:
					"Invalid JSON. Please check commas, brackets, and key/value pairs.",
				isEmpty: false,
			};
		}
	}, [content]);

	const copyToClipboard = async (): Promise<void> => {
		if (!content.trim()) return;

		await navigator.clipboard.writeText(content);
		toast.success("Copied to clipboard!", { duration: 2000 });
	};

	const copyExport = async (format: "csharp" | "typescript"): Promise<void> => {
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

		try {
			const generated =
				format === "csharp"
					? generateCSharpClasses(parsedResult.data, ROOT_MODEL_NAME)
					: generateTypeScriptInterfaces(parsedResult.data, ROOT_MODEL_NAME);

			await navigator.clipboard.writeText(generated);
			toast.success(
				format === "csharp"
					? "C# model copied to clipboard."
					: "TypeScript interface copied to clipboard.",
				{ duration: 2500 },
			);
		} catch {
			toast.error(
				"Failed to export model. Please try with another JSON shape.",
				{ duration: 3000 },
			);
		}
	};

	const formattedJsonString = parsedResult.data
		? JSON.stringify(parsedResult.data, null, 2)
		: "";

	if (parsedResult.isEmpty) {
		return (
			<div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/10 p-8 text-center">
				<p className="text-sm text-muted-foreground">
					No preview yet. Paste JSON in the Input panel to see formatted output.
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
							<Button variant="ghost" size="sm" className="gap-2 border">
								<Download className="h-4 w-4" />
								Export
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-60">
							<DropdownMenuItem onClick={() => copyExport("csharp")}>
								Export C# Class (Model)
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => copyExport("typescript")}>
								Export TypeScript Interface (Model)
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
		</div>
	);
}
