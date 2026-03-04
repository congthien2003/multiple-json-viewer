"use client";

import { useRef } from "react";
import { AlertCircle, Check, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { useTheme } from "next-themes";
import { JSONFormatter } from "@/lib/json-formatter";
import toast from "react-hot-toast";

interface JsonEditorProps {
	value: string;
	onChange: (value: string) => void;
	onFormat?: () => void;
}

export function JsonEditor({ value, onChange, onFormat }: JsonEditorProps) {
	const { resolvedTheme } = useTheme();
	const validation = JSONFormatter.validateJSON(value);

	const handleFormat = (): void => {
		try {
			const formatted = JSONFormatter.formatJSON(value, 2);
			onChange(formatted);
			onFormat?.();
			toast.success("JSON formatted", { duration: 1800 });
		} catch (error) {
			console.error("Format error:", error);
			toast.error("Format failed. Please check JSON validity.", {
				duration: 2200,
			});
		}
	};

	const handleMinify = (): void => {
		try {
			const minified = JSONFormatter.minifyJSON(value);
			onChange(minified);
			toast.success("JSON minified", { duration: 1800 });
		} catch (error) {
			console.error("Minify error:", error);
			toast.error("Minify failed. Please check JSON validity.", {
				duration: 2200,
			});
		}
	};

	const stats = value
		? JSONFormatter.getJSONSize(value)
		: { chars: 0, lines: 0, size: "0 B" };

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{validation.valid ? (
						<div className="flex items-center gap-2 text-sm text-green-600">
							<Check className="h-4 w-4" />
							Valid JSON
						</div>
					) : value ? (
						<div className="flex items-center gap-2 text-sm text-red-600">
							<AlertCircle className="h-4 w-4" />
							Invalid JSON
						</div>
					) : (
						<div className="text-sm text-muted-foreground">
							Paste your JSON here
						</div>
					)}
				</div>
				<div className="text-xs text-muted-foreground">
					{stats.lines}lines • {stats.chars}chars • {stats.size}
				</div>
			</div>

			{!validation.valid && value && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{validation.error}</AlertDescription>
				</Alert>
			)}

			<div className="min-h-0 flex-1 overflow-hidden rounded-md border shadow-sm">
				<CodeMirror
					value={value}
					height="100%"
					extensions={[json()]}
					onChange={(val) => onChange(val)}
					theme={resolvedTheme === "light" ? "light" : "dark"}
					className="h-full text-sm font-mono"
				/>
			</div>

			<div className="flex gap-2">
				<Button
					onClick={handleFormat}
					disabled={!validation.valid || !value}
					variant="outline"
					size="sm"
					className="gap-2">
					<Wand2 className="h-4 w-4" />
					Format
				</Button>
				<Button
					onClick={handleMinify}
					disabled={!validation.valid || !value}
					variant="outline"
					size="sm">
					Minify
				</Button>
			</div>
		</div>
	);
}
