"use client";

import { useEffect, useRef } from "react";
import { MergeView } from "@codemirror/merge";
import { json } from "@codemirror/lang-json";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import type { ThemeType } from "@/types";

interface JsonDiffViewerProps {
	leftContent: string;
	rightContent: string;
	leftLabel: string;
	rightLabel: string;
	theme: ThemeType;
}

const formatJson = (content: string): string => {
	try {
		return JSON.stringify(JSON.parse(content), null, 2);
	} catch {
		return content || "";
	}
};

export function JsonDiffViewer({
	leftContent,
	rightContent,
	leftLabel,
	rightLabel,
	theme,
}: JsonDiffViewerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const viewRef = useRef<MergeView | null>(null);

	const isDark = theme !== "light";

	useEffect(() => {
		if (!containerRef.current) return;

		// Clean up previous instance
		if (viewRef.current) {
			viewRef.current.destroy();
			viewRef.current = null;
		}

		const left = formatJson(leftContent);
		const right = formatJson(rightContent);

		const mergeView = new MergeView({
			a: {
				doc: left,
				extensions: [
					EditorView.lineWrapping,
					json(),
					EditorState.readOnly.of(true),
					EditorView.editable.of(false),
					isDark ? EditorView.theme({}, { dark: true }) : [],
				],
			},
			b: {
				doc: right,
				extensions: [
					EditorView.lineWrapping,
					json(),
					EditorState.readOnly.of(true),
					EditorView.editable.of(false),
					isDark ? EditorView.theme({}, { dark: true }) : [],
				],
			},
			parent: containerRef.current,
			collapseUnchanged: { margin: 3, minSize: 4 },
		});

		viewRef.current = mergeView;

		return () => {
			mergeView.destroy();
			viewRef.current = null;
		};
	}, [leftContent, rightContent, isDark]);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="flex border-b text-xs font-medium text-muted-foreground shrink-0">
				<div className="flex-1 px-3 py-2 border-r max-w-[50%] truncate">
					{leftLabel}
				</div>
				<div className="flex-1 px-3 py-2 max-w-[50%] truncate">
					{rightLabel}
				</div>
			</div>
			<div
				ref={containerRef}
				className="min-h-0 flex-1 overflow-hidden text-sm font-mono [&_.cm-mergeView]:h-full [&_.cm-editor]:h-full"
			/>
		</div>
	);
}
