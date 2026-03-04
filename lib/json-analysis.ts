/**
 * JSON Analysis utilities for charting and size heatmap.
 */

export interface ChartableDataset {
	label: string;
	nameKey: string;
	valueKeys: string[];
	data: Record<string, unknown>[];
}

export interface SizeEntry {
	key: string;
	sizeBytes: number;
	percentage: number;
}

/**
 * Recursively scan JSON for arrays of objects with numeric fields.
 * Returns chartable datasets found up to maxDepth levels.
 */
export function analyzeChartableData(
	data: unknown,
	maxDepth = 5,
): ChartableDataset[] {
	const results: ChartableDataset[] = [];
	scan(data, "", maxDepth, results);
	return results;
}

function scan(
	node: unknown,
	path: string,
	depth: number,
	results: ChartableDataset[],
): void {
	if (depth <= 0 || node === null || node === undefined) return;

	if (Array.isArray(node) && node.length >= 2) {
		const dataset = tryExtractDataset(node, path || "root");
		if (dataset) {
			results.push(dataset);
		}
	}

	if (typeof node === "object" && node !== null && !Array.isArray(node)) {
		const obj = node as Record<string, unknown>;
		for (const key of Object.keys(obj)) {
			scan(obj[key], path ? `${path}.${key}` : key, depth - 1, results);
		}
	}
}

function tryExtractDataset(
	arr: unknown[],
	path: string,
): ChartableDataset | null {
	// All items must be objects
	const objects = arr.filter(
		(item): item is Record<string, unknown> =>
			typeof item === "object" && item !== null && !Array.isArray(item),
	);
	if (objects.length < 2) return null;

	// Find numeric keys present in most items (>= 60%)
	const threshold = objects.length * 0.6;
	const keyCounts: Record<string, number> = {};
	const stringKeyCounts: Record<string, number> = {};

	for (const obj of objects) {
		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === "number" && isFinite(value)) {
				keyCounts[key] = (keyCounts[key] || 0) + 1;
			} else if (typeof value === "string") {
				stringKeyCounts[key] = (stringKeyCounts[key] || 0) + 1;
			}
		}
	}

	const valueKeys = Object.entries(keyCounts)
		.filter(([, count]) => count >= threshold)
		.map(([key]) => key);

	if (valueKeys.length === 0) return null;

	// Find best string key for labels (highest count)
	const nameKey =
		Object.entries(stringKeyCounts)
			.filter(([, count]) => count >= threshold)
			.sort((a, b) => b[1] - a[1])[0]?.[0] || "";

	return {
		label: path,
		nameKey,
		valueKeys,
		data: objects,
	};
}

/**
 * Compute the byte-size contribution of each top-level key.
 * Returns entries sorted descending by size.
 */
export function analyzeSizeMap(data: unknown): SizeEntry[] {
	if (typeof data !== "object" || data === null || Array.isArray(data)) {
		// For arrays or primitives, return a single entry
		const totalSize = new Blob([JSON.stringify(data)]).size;
		return [{ key: "(root)", sizeBytes: totalSize, percentage: 100 }];
	}

	const obj = data as Record<string, unknown>;
	const entries: SizeEntry[] = [];
	let totalSize = 0;

	for (const [key, value] of Object.entries(obj)) {
		const size = new Blob([JSON.stringify(value)]).size;
		entries.push({ key, sizeBytes: size, percentage: 0 });
		totalSize += size;
	}

	// Compute percentages
	for (const entry of entries) {
		entry.percentage =
			totalSize > 0
				? Math.round((entry.sizeBytes / totalSize) * 1000) / 10
				: 0;
	}

	// Sort descending
	entries.sort((a, b) => b.sizeBytes - a.sizeBytes);
	return entries;
}

/**
 * Format bytes into human-readable string.
 */
export function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
