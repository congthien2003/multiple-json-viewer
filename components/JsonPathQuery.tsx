"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JSONPath } from "jsonpath-plus";

interface JsonPathQueryProps {
	content: string;
	onResult: (filtered: string | null) => void;
}

export function JsonPathQuery({ content, onResult }: JsonPathQueryProps) {
	const [query, setQuery] = useState("");
	const [error, setError] = useState<string | null>(null);

	const parsedData = useMemo(() => {
		try {
			return JSON.parse(content) as unknown;
		} catch {
			return null;
		}
	}, [content]);

	const executeQuery = useCallback(
		(q: string) => {
			if (!q.trim() || !parsedData) {
				onResult(null);
				setError(null);
				return;
			}

			try {
				const result = JSONPath({ path: q, json: parsedData as object });
				setError(null);
				onResult(JSON.stringify(result, null, 2));
			} catch (e) {
				setError(e instanceof Error ? e.message : "Invalid JSONPath");
				onResult(null);
			}
		},
		[parsedData, onResult],
	);

	useEffect(() => {
		const timer = setTimeout(() => executeQuery(query), 300);
		return () => clearTimeout(timer);
	}, [query, executeQuery]);

	const handleClear = () => {
		setQuery("");
		setError(null);
		onResult(null);
	};

	return (
		<div className="flex flex-col gap-1">
			<div className="relative flex items-center">
				<Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="JSONPath query, e.g. $.store.book[*].author"
					className="pl-9 pr-9 font-mono text-sm h-8"
				/>
				{query && (
					<Button
						variant="ghost"
						size="icon-xs"
						onClick={handleClear}
						className="absolute right-1">
						<X className="h-3 w-3" />
					</Button>
				)}
			</div>
			{error && (
				<p className="text-xs text-destructive px-1 truncate">{error}</p>
			)}
		</div>
	);
}
