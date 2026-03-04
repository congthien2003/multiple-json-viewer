"use client";

import { useMemo, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";
import {
	analyzeSizeMap,
	formatBytes,
	type SizeEntry,
} from "@/lib/json-analysis";

interface JsonSizeHeatmapProps {
	data: unknown;
}

const HEATMAP_COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
];

export function JsonSizeHeatmap({ data }: JsonSizeHeatmapProps) {
	const [open, setOpen] = useState(false);

	const sizeEntries: SizeEntry[] = useMemo(
		() => analyzeSizeMap(data),
		[data],
	);

	if (sizeEntries.length <= 1 && sizeEntries[0]?.key === "(root)") {
		return null;
	}

	const totalBytes = sizeEntries.reduce((sum, e) => sum + e.sizeBytes, 0);

	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				className="gap-2 border"
				onClick={() => setOpen(true)}>
				<Ruler className="h-4 w-4" />
				Size Map
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
					<DialogHeader>
						<DialogTitle>
							JSON Size Heatmap — Total: {formatBytes(totalBytes)}
						</DialogTitle>
					</DialogHeader>

					{/* Stacked bar overview */}
					<div className="shrink-0">
						<div className="flex h-8 w-full overflow-hidden rounded-lg border">
							{sizeEntries.map((entry, i) => (
								<div
									key={entry.key}
									className="h-full transition-all relative group"
									style={{
										width: `${entry.percentage}%`,
										backgroundColor:
											HEATMAP_COLORS[
												i % HEATMAP_COLORS.length
											],
										minWidth:
											entry.percentage > 0 ? "2px" : "0",
									}}
									title={`${entry.key}: ${formatBytes(entry.sizeBytes)} (${entry.percentage}%)`}>
									{entry.percentage > 8 && (
										<span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-sm truncate px-1">
											{entry.key}
										</span>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Detail bar chart */}
					<div className="flex-1 min-h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={sizeEntries}
								layout="vertical"
								margin={{ left: 8, right: 24 }}>
								<XAxis
									type="number"
									tick={{ fontSize: 11 }}
									tickFormatter={(v: number) =>
										formatBytes(v)
									}
								/>
								<YAxis
									dataKey="key"
									type="category"
									tick={{ fontSize: 12 }}
									width={120}
								/>
								<Tooltip
									formatter={(value: number) => [
										formatBytes(value),
										"Size",
									]}
									contentStyle={{
										backgroundColor: "var(--popover)",
										border: "1px solid var(--border)",
										borderRadius: "8px",
										color: "var(--popover-foreground)",
									}}
								/>
								<Bar dataKey="sizeBytes" radius={[0, 4, 4, 0]}>
									{sizeEntries.map((_, i) => (
										<Cell
											key={i}
											fill={
												HEATMAP_COLORS[
													i % HEATMAP_COLORS.length
												]
											}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>

					{/* Legend table */}
					<div className="shrink-0 max-h-40 overflow-auto rounded-md border">
						<table className="w-full text-sm">
							<thead className="sticky top-0 bg-muted">
								<tr>
									<th className="text-left px-3 py-1.5 font-medium">
										Key
									</th>
									<th className="text-right px-3 py-1.5 font-medium">
										Size
									</th>
									<th className="text-right px-3 py-1.5 font-medium">
										%
									</th>
								</tr>
							</thead>
							<tbody>
								{sizeEntries.map((entry, i) => (
									<tr
										key={entry.key}
										className="border-t border-border/40">
										<td className="px-3 py-1.5 flex items-center gap-2">
											<span
												className="inline-block w-3 h-3 rounded-sm shrink-0"
												style={{
													backgroundColor:
														HEATMAP_COLORS[
															i %
																HEATMAP_COLORS.length
														],
												}}
											/>
											<span className="truncate font-mono text-xs">
												{entry.key}
											</span>
										</td>
										<td className="text-right px-3 py-1.5 font-mono text-xs">
											{formatBytes(entry.sizeBytes)}
										</td>
										<td className="text-right px-3 py-1.5 text-muted-foreground">
											{entry.percentage}%
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
