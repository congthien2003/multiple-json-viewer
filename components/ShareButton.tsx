"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { compressToUrl, isWithinUrlLimit } from "@/lib/json-share";
import toast from "react-hot-toast";

interface ShareButtonProps {
	content: string;
}

export function ShareButton({ content }: ShareButtonProps) {
	const [open, setOpen] = useState(false);
	const [shareUrl, setShareUrl] = useState("");
	const [copied, setCopied] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleShare = async () => {
		if (!content.trim()) {
			toast.error("No JSON content to share.", { duration: 2000 });
			return;
		}

		setLoading(true);
		try {
			const compressed = await compressToUrl(content);

			if (!isWithinUrlLimit(compressed)) {
				toast.error(
					"JSON is too large to encode in a URL. Try with smaller data.",
					{ duration: 3000 },
				);
				setLoading(false);
				return;
			}

			const url = `${window.location.origin}${window.location.pathname}?data=${compressed}`;
			setShareUrl(url);
			setOpen(true);
		} catch {
			toast.error("Failed to compress JSON.", { duration: 2500 });
		} finally {
			setLoading(false);
		}
	};

	const handleCopy = async () => {
		await navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		toast.success("Share URL copied!", { duration: 2000 });
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				className="gap-2 border"
				onClick={handleShare}
				disabled={loading || !content.trim()}>
				<Link2 className="h-4 w-4" />
				{loading ? "Compressing..." : "Share"}
			</Button>

			<Dialog
				open={open}
				onOpenChange={(v) => {
					setOpen(v);
					if (!v) setCopied(false);
				}}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Share this JSON</DialogTitle>
					</DialogHeader>

					<p className="text-sm text-muted-foreground">
						Anyone with this link can view this JSON data directly
						in the viewer.
					</p>

					<div className="flex gap-2">
						<input
							readOnly
							value={shareUrl}
							className="flex-1 rounded-md border bg-muted px-3 py-2 text-xs font-mono truncate focus:outline-none focus:ring-1 focus:ring-ring"
							onClick={(e) =>
								(e.target as HTMLInputElement).select()
							}
						/>
						<Button
							onClick={handleCopy}
							size="sm"
							className="shrink-0 gap-2">
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<Link2 className="h-4 w-4" />
							)}
							{copied ? "Copied!" : "Copy"}
						</Button>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setOpen(false)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
