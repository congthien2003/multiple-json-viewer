"use client";

import { useMemo, useState } from "react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BarChart3 } from "lucide-react";
import {
	analyzeChartableData,
	type ChartableDataset,
} from "@/lib/json-analysis";

interface JsonChartPanelProps {
	data: unknown;
}

const CHART_COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
];

type ChartType = "bar" | "line";

export function JsonChartPanel({ data }: JsonChartPanelProps) {
	const [open, setOpen] = useState(false);
	const [chartType, setChartType] = useState<ChartType>("bar");
	const [selectedIndex, setSelectedIndex] = useState(0);

	const datasets: ChartableDataset[] = useMemo(
		() => analyzeChartableData(data),
		[data],
	);

	if (datasets.length === 0) return null;

	const active = datasets[selectedIndex] || datasets[0];

	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				className="gap-2 border"
				onClick={() => setOpen(true)}>
				<BarChart3 className="h-4 w-4" />
				Chart
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
					<DialogHeader>
						<DialogTitle>JSON Chart Visualization</DialogTitle>
					</DialogHeader>

					<div className="flex flex-wrap items-center gap-3 shrink-0">
						{datasets.length > 1 && (
							<Select
								value={String(selectedIndex)}
								onValueChange={(v) =>
									setSelectedIndex(Number(v))
								}>
								<SelectTrigger className="w-52">
									<SelectValue placeholder="Select dataset" />
								</SelectTrigger>
								<SelectContent>
									{datasets.map((ds, i) => (
										<SelectItem key={i} value={String(i)}>
											{ds.label} ({ds.data.length} items)
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}

						<div className="flex gap-1 rounded-md border p-1">
							<Button
								variant={
									chartType === "bar" ? "default" : "ghost"
								}
								size="sm"
								onClick={() => setChartType("bar")}>
								Bar
							</Button>
							<Button
								variant={
									chartType === "line" ? "default" : "ghost"
								}
								size="sm"
								onClick={() => setChartType("line")}>
								Line
							</Button>
						</div>
					</div>

					<div className="flex-1 min-h-[350px]">
						<ResponsiveContainer width="100%" height="100%">
							{chartType === "bar" ? (
								<BarChart data={active.data}>
									<CartesianGrid
										strokeDasharray="3 3"
										opacity={0.3}
									/>
									<XAxis
										dataKey={active.nameKey || undefined}
										tick={{ fontSize: 12 }}
									/>
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip
										contentStyle={{
											backgroundColor: "var(--popover)",
											border: "1px solid var(--border)",
											borderRadius: "8px",
											color: "var(--popover-foreground)",
										}}
									/>
									<Legend />
									{active.valueKeys.map((key, i) => (
										<Bar
											key={key}
											dataKey={key}
											fill={
												CHART_COLORS[
													i % CHART_COLORS.length
												]
											}
											radius={[4, 4, 0, 0]}
										/>
									))}
								</BarChart>
							) : (
								<LineChart data={active.data}>
									<CartesianGrid
										strokeDasharray="3 3"
										opacity={0.3}
									/>
									<XAxis
										dataKey={active.nameKey || undefined}
										tick={{ fontSize: 12 }}
									/>
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip
										contentStyle={{
											backgroundColor: "var(--popover)",
											border: "1px solid var(--border)",
											borderRadius: "8px",
											color: "var(--popover-foreground)",
										}}
									/>
									<Legend />
									{active.valueKeys.map((key, i) => (
										<Line
											key={key}
											type="monotone"
											dataKey={key}
											stroke={
												CHART_COLORS[
													i % CHART_COLORS.length
												]
											}
											strokeWidth={2}
											dot={{ r: 4 }}
										/>
									))}
								</LineChart>
							)}
						</ResponsiveContainer>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
