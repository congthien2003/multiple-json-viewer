/**
 * JSON Share utilities — compress/decompress JSON into URL-safe strings
 * using native CompressionStream API (zero dependencies).
 */

const MAX_COMPRESSED_LENGTH = 8192; // ~8KB limit for URL

/**
 * Compress a JSON string into a URL-safe base64 string using gzip.
 */
export async function compressToUrl(content: string): Promise<string> {
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(encoder.encode(content));
			controller.close();
		},
	});

	const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));

	const reader = compressedStream.getReader();
	const chunks: Uint8Array[] = [];

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
	}

	const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
	const merged = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		merged.set(chunk, offset);
		offset += chunk.length;
	}

	// Convert to base64 URL-safe
	const base64 = btoa(String.fromCharCode(...merged))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");

	return base64;
}

/**
 * Decompress a URL-safe base64 string back to JSON.
 */
export async function decompressFromUrl(hash: string): Promise<string> {
	// Restore standard base64
	let base64 = hash.replace(/-/g, "+").replace(/_/g, "/");
	while (base64.length % 4 !== 0) {
		base64 += "=";
	}

	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(bytes);
			controller.close();
		},
	});

	const decompressedStream = stream.pipeThrough(
		new DecompressionStream("gzip"),
	);

	const reader = decompressedStream.getReader();
	const decoder = new TextDecoder();
	let result = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		result += decoder.decode(value, { stream: true });
	}

	return result;
}

/**
 * Check if the compressed content would exceed URL limits.
 */
export function isWithinUrlLimit(compressed: string): boolean {
	return compressed.length <= MAX_COMPRESSED_LENGTH;
}
