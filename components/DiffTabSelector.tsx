"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { JsonTab } from "@/types";

interface DiffTabSelectorProps {
	tabs: JsonTab[];
	leftTabId: string | null;
	rightTabId: string | null;
	onLeftChange: (id: string) => void;
	onRightChange: (id: string) => void;
}

export function DiffTabSelector({
	tabs,
	leftTabId,
	rightTabId,
	onLeftChange,
	onRightChange,
}: DiffTabSelectorProps) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex items-center gap-2">
				<span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
					Tab A:
				</span>
				<Select value={leftTabId ?? ""} onValueChange={onLeftChange}>
					<SelectTrigger className="h-8 w-40 text-xs">
						<SelectValue placeholder="Select tab" />
					</SelectTrigger>
					<SelectContent>
						{tabs.map((tab) => (
							<SelectItem key={tab.id} value={tab.id}>
								{tab.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<span className="text-muted-foreground font-mono text-xs">vs</span>

			<div className="flex items-center gap-2">
				<span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
					Tab B:
				</span>
				<Select value={rightTabId ?? ""} onValueChange={onRightChange}>
					<SelectTrigger className="h-8 w-40 text-xs">
						<SelectValue placeholder="Select tab" />
					</SelectTrigger>
					<SelectContent>
						{tabs.map((tab) => (
							<SelectItem key={tab.id} value={tab.id}>
								{tab.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
