import type { Metadata } from "next";
import Link from "next/link";
import {
	Zap,
	Code2,
	Copy,
	ChevronRight,
	FileJson,
	ArrowRight,
	CheckCircle2,
	Braces,
	AlignLeft,
	Download,
	GitCompareArrows,
	Search,
	BarChart3,
	Ruler,
	Link2,
	Layers,
	Palette,
	Shield,
} from "lucide-react";

export const metadata: Metadata = {
	title: "JSON Viewer — Advanced Multi-Tab JSON Editor",
	description:
		"A modern, feature-rich JSON viewer. Multi-tab, syntax highlighting, JSON Diff, JSONPath, Charting, Size Heatmap, URL Sharing, and export to 7 languages.",
};

// ─────────────────────────── DATA ─────────────────────────────

const features = [
	{
		icon: Layers,
		tag: "Core",
		title: "Multi-Tab Workspace",
		description:
			"Manage multiple JSON documents simultaneously. Each tab is persisted to LocalStorage — your data survives page refresh with zero cloud dependency.",
		accent: "from-sky-500 to-blue-600",
		glow: "rgba(14,165,233,0.15)",
		sample: null,
	},
	{
		icon: Code2,
		tag: "Editor",
		title: "Code Editor Input",
		description:
			"Powered by CodeMirror. Auto-closing brackets, JSON syntax highlighting, keyboard shortcuts, and code folding — not just a textarea.",
		accent: "from-indigo-500 to-violet-600",
		glow: "rgba(99,102,241,0.15)",
		sample: null,
	},
	{
		icon: GitCompareArrows,
		tag: "New",
		title: "JSON Diff Compare",
		description:
			"Compare any two tabs side-by-side with a split diff view. Added, removed, and modified lines are highlighted with different colors.",
		accent: "from-teal-500 to-emerald-600",
		glow: "rgba(20,184,166,0.15)",
		sample: null,
	},
	{
		icon: Search,
		tag: "New",
		title: "JSONPath Query",
		description:
			"Filter and drill into deep JSON structures using standard JSONPath expressions (e.g., $.users[*].email). Results update instantly as you type.",
		accent: "from-amber-500 to-orange-600",
		glow: "rgba(245,158,11,0.15)",
		sample: "$.store.books[?(@.price < 10)].title",
	},
	{
		icon: BarChart3,
		tag: "New",
		title: "JSON Charting",
		description:
			"Automatically detects arrays with numeric fields and lets you visualize them as Bar or Line charts — no configuration needed.",
		accent: "from-pink-500 to-rose-600",
		glow: "rgba(236,72,153,0.15)",
		sample: null,
	},
	{
		icon: Ruler,
		tag: "New",
		title: "Size Heatmap",
		description:
			"See which keys consume the most bytes in your JSON at a glance. A stacked bar and detail chart make it trivial to spot oversized fields.",
		accent: "from-purple-500 to-fuchsia-600",
		glow: "rgba(168,85,247,0.15)",
		sample: null,
	},
	{
		icon: Link2,
		tag: "New",
		title: "Sharable URL",
		description:
			"Compress your entire JSON into a URL using native CompressionStream (no server, no cookies). Share the link and the receiver sees your data instantly.",
		accent: "from-cyan-500 to-teal-600",
		glow: "rgba(6,182,212,0.15)",
		sample: null,
	},
	{
		icon: Download,
		tag: "Updated",
		title: "Export to 7 Languages",
		description:
			"Generate typed models from any JSON in TypeScript, C#, Java, Python (Pydantic), Go, Kotlin, and Dart — with a preview modal before copying.",
		accent: "from-violet-500 to-indigo-600",
		glow: "rgba(139,92,246,0.15)",
		sample: null,
	},
	{
		icon: Palette,
		tag: "Core",
		title: "4 Beautiful Themes",
		description:
			"Light, Dark, Monokai, Dracula — switch in one click. Your preference is auto-saved.",
		accent: "from-fuchsia-500 to-pink-600",
		glow: "rgba(217,70,239,0.15)",
		sample: null,
	},
	{
		icon: Shield,
		tag: "Privacy",
		title: "100% Private",
		description:
			"Your data never leaves the browser. No tracking. No cloud sync. No account needed.",
		accent: "from-emerald-500 to-green-600",
		glow: "rgba(16,185,129,0.15)",
		sample: null,
	},
];

const exportLanguages = [
	{ name: "TypeScript", color: "#3178C6", badge: "Interface" },
	{ name: "C#", color: "#9B4F96", badge: "Class" },
	{ name: "Java", color: "#0074BD", badge: "POJO" },
	{ name: "Python", color: "#3776AB", badge: "Pydantic" },
	{ name: "Go", color: "#00ACD7", badge: "Struct" },
	{ name: "Kotlin", color: "#7F52FF", badge: "Data Class" },
	{ name: "Dart", color: "#00B4AB", badge: "Class" },
];

const jsonSample = `{
  "name": "Alice",
  "age": 28,
  "active": true,
  "address": {
    "city": "HCM",
    "zip": 70000
  }
}`;

// ─────────────────────────── PAGE ─────────────────────────────

export default function LandingPage() {
	return (
		<div
			className="min-h-screen overflow-x-hidden"
			style={{
				background:
					"linear-gradient(160deg, oklch(0.10 0.018 260) 0%, oklch(0.3092 0.0518 219.6516) 100%)",
			}}>
			{/* ── Background orbs ── */}
			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="bg-orb bg-orb-1" />
				<div className="bg-orb bg-orb-2" />
			</div>

			{/* ═══════════════ NAVBAR ═══════════════ */}
			<header
				className="animate-slideDown fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl rounded-2xl"
				style={{
					background: "rgba(12,12,28,0.80)",
					backdropFilter: "blur(16px)",
					border: "1px solid rgba(255,255,255,0.09)",
				}}>
				<div className="flex items-center justify-between px-6 py-3">
					<Link
						href="/"
						aria-label="JSON Viewer home"
						className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-md">
							<Braces className="h-5 w-5 text-white" />
						</div>
						<span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent">
							JSON Viewer
						</span>
					</Link>

					<nav
						className="hidden items-center gap-6 md:flex"
						aria-label="Main navigation">
						<a
							href="#features"
							className="text-sm text-slate-400 transition-colors hover:text-white">
							Features
						</a>
						<a
							href="#export"
							className="text-sm text-slate-400 transition-colors hover:text-white">
							Export
						</a>
						<a
							href="#how-it-works"
							className="text-sm text-slate-400 transition-colors hover:text-white">
							How it works
						</a>
					</nav>

					<Link
						href="/"
						className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105">
						Launch App
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</header>

			{/* ═══════════════ HERO ═══════════════ */}
			<section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-20 text-center">
				{/* Badge */}
				<div
					className="animate-fadeIn mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-sky-300"
					style={{
						background: "rgba(14,165,233,0.12)",
						border: "1px solid rgba(14,165,233,0.25)",
					}}>
					<Zap className="h-3.5 w-3.5 fill-sky-400 text-sky-400" />
					Free &amp; Open Source · 10 powerful features
				</div>

				{/* Headline */}
				<h1 className="animate-slideUp mx-auto mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
					The JSON tool that&apos;s actually{" "}
					<span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
						built for developers
					</span>
				</h1>

				{/* Sub-headline */}
				<p className="animate-fadeIn mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400">
					Multi-tab editing · Real-time validation · JSON Diff ·
					JSONPath Query · Chart visualization · Size Heatmap ·
					Sharable URL · Export to{" "}
					<span className="font-semibold text-sky-300">
						7 languages
					</span>
				</p>

				{/* CTA row */}
				<div className="animate-fadeIn flex flex-col items-center gap-3 sm:flex-row">
					<Link
						href="/"
						className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-sky-500/30">
						<FileJson className="h-5 w-5" />
						Open JSON Viewer
						<ChevronRight className="h-4 w-4" />
					</Link>
					<a
						href="https://github.com/congthien2003/multiple-json-viewer"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 rounded-2xl px-8 py-3.5 text-base font-semibold text-slate-300 transition-all hover:text-white"
						style={{
							background: "rgba(255,255,255,0.06)",
							border: "1px solid rgba(255,255,255,0.12)",
						}}>
						View on GitHub
					</a>
				</div>

				{/* App mockup */}
				<div className="animate-fadeIn relative mx-auto mt-20 w-full max-w-4xl">
					<div
						className="relative overflow-hidden rounded-2xl shadow-2xl"
						style={{
							background: "rgba(15,15,35,0.85)",
							backdropFilter: "blur(12px)",
							border: "1px solid rgba(255,255,255,0.09)",
						}}>
						{/* Window chrome */}
						<div
							className="flex items-center gap-2 border-b px-4 py-3"
							style={{ borderColor: "rgba(255,255,255,0.07)" }}>
							<div className="h-3 w-3 rounded-full bg-red-500/80" />
							<div className="h-3 w-3 rounded-full bg-yellow-500/80" />
							<div className="h-3 w-3 rounded-full bg-green-500/80" />
							<div className="ml-4 flex gap-2">
								<div
									className="rounded-md px-3 py-1 text-xs text-slate-300"
									style={{
										background: "rgba(14,165,233,0.18)",
										border: "1px solid rgba(14,165,233,0.3)",
									}}>
									user.json
								</div>
								<div
									className="rounded-md px-3 py-1 text-xs text-slate-500"
									style={{
										background: "rgba(255,255,255,0.04)",
										border: "1px solid rgba(255,255,255,0.08)",
									}}>
									config.json
								</div>
								<div
									className="rounded-md px-3 py-1 text-xs text-slate-500"
									style={{
										background: "rgba(255,255,255,0.04)",
										border: "1px solid rgba(255,255,255,0.08)",
									}}>
									metrics.json
								</div>
							</div>
							{/* Toolbar */}
							<div className="ml-auto flex gap-1.5">
								{["Chart", "Size Map", "Share", "Export"].map(
									(btn) => (
										<div
											key={btn}
											className="rounded-md px-2.5 py-1 text-[10px] text-slate-400"
											style={{
												background:
													"rgba(255,255,255,0.06)",
												border: "1px solid rgba(255,255,255,0.09)",
											}}>
											{btn}
										</div>
									),
								)}
							</div>
						</div>
						{/* Two-panel layout */}
						<div className="grid grid-cols-2 gap-0 text-left">
							<div
								className="border-r p-5"
								style={{
									borderColor: "rgba(255,255,255,0.07)",
								}}>
								<p className="mb-2 text-xs font-medium text-slate-500">
									JSON Input
								</p>
								<pre className="font-mono text-xs leading-relaxed text-slate-300">
									{jsonSample}
								</pre>
							</div>
							<div className="p-5">
								<p className="mb-2 text-xs font-medium text-slate-500">
									Formatted Preview
								</p>
								<div className="space-y-1 font-mono text-xs leading-relaxed">
									<span className="text-slate-400">
										{"{"}
									</span>
									<div className="pl-4">
										<span className="text-sky-400">
											&quot;name&quot;
										</span>
										<span className="text-slate-400">
											:{" "}
										</span>
										<span className="text-emerald-400">
											&quot;Alice&quot;
										</span>
										<span className="text-slate-400">
											,
										</span>
									</div>
									<div className="pl-4">
										<span className="text-sky-400">
											&quot;age&quot;
										</span>
										<span className="text-slate-400">
											:{" "}
										</span>
										<span className="text-orange-400">
											28
										</span>
										<span className="text-slate-400">
											,
										</span>
									</div>
									<div className="pl-4">
										<span className="text-sky-400">
											&quot;active&quot;
										</span>
										<span className="text-slate-400">
											:{" "}
										</span>
										<span className="text-red-400">
											true
										</span>
										<span className="text-slate-400">
											,
										</span>
									</div>
									<div className="pl-4">
										<span className="text-sky-400">
											&quot;address&quot;
										</span>
										<span className="text-slate-400">
											: {"{"}
										</span>
									</div>
									<div className="pl-8">
										<span className="text-sky-400">
											&quot;city&quot;
										</span>
										<span className="text-slate-400">
											:{" "}
										</span>
										<span className="text-emerald-400">
											&quot;HCM&quot;
										</span>
									</div>
									<div className="pl-4">
										<span className="text-slate-400">
											{"}"}
										</span>
									</div>
									<span className="text-slate-400">
										{"}"}
									</span>
								</div>
							</div>
						</div>
						{/* Status bar */}
						<div
							className="flex items-center gap-4 border-t px-5 py-2 text-xs text-slate-500"
							style={{ borderColor: "rgba(255,255,255,0.07)" }}>
							<span className="flex items-center gap-1.5 text-emerald-400">
								<CheckCircle2 className="h-3.5 w-3.5" /> Valid
								JSON
							</span>
							<span>6 keys · 2 levels</span>
							<span className="ml-auto">120 chars</span>
						</div>
					</div>
					<div
						className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl opacity-25 blur-2xl"
						style={{
							background:
								"linear-gradient(135deg, rgba(14,165,233,0.5) 0%, rgba(99,102,241,0.5) 100%)",
						}}
					/>
				</div>
			</section>

			{/* ═══════════════ FEATURES ═══════════════ */}
			<section id="features" className="relative px-4 py-24">
				<div className="mx-auto max-w-6xl">
					<div className="mb-16 text-center">
						<p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-400">
							Features
						</p>
						<h2 className="text-4xl font-bold text-white md:text-5xl">
							Every tool a JSON developer{" "}
							<span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
								actually needs
							</span>
						</h2>
					</div>

					{/* Feature list — alternating */}
					<div className="space-y-5">
						{features.map((feature, i) => {
							const Icon = feature.icon;
							const tagColors: Record<string, string> = {
								New: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
								Updated:
									"text-amber-300 border-amber-500/30 bg-amber-500/10",
								Core: "text-sky-300 border-sky-500/30 bg-sky-500/10",
								Privacy:
									"text-teal-300 border-teal-500/30 bg-teal-500/10",
							};
							return (
								<div
									key={i}
									className="group flex items-start gap-5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
									style={{
										background: `rgba(255,255,255,0.03)`,
										border: "1px solid rgba(255,255,255,0.08)",
									}}>
									{/* Icon */}
									<div
										className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} shadow-lg`}>
										<Icon className="h-5 w-5 text-white" />
									</div>
									{/* Text */}
									<div className="flex-1">
										<div className="mb-1 flex items-center gap-2">
											<h3 className="text-base font-semibold text-white">
												{feature.title}
											</h3>
											<span
												className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tagColors[feature.tag] ?? ""}`}>
												{feature.tag}
											</span>
										</div>
										<p className="text-sm leading-relaxed text-slate-400">
											{feature.description}
										</p>
										{feature.sample && (
											<code className="mt-2 inline-block rounded-lg bg-white/5 px-3 py-1.5 font-mono text-xs text-amber-300">
												{feature.sample}
											</code>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ═══════════════ EXPORT SHOWCASE ═══════════════ */}
			<section id="export" className="px-4 py-24">
				<div className="mx-auto max-w-6xl">
					<div
						className="overflow-hidden rounded-3xl"
						style={{
							background:
								"linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.10) 100%)",
							border: "1px solid rgba(139,92,246,0.18)",
						}}>
						<div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
							{/* Left */}
							<div className="p-10 lg:p-14">
								<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
									<Code2 className="h-7 w-7 text-white" />
								</div>
								<h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
									Generate typed models{" "}
									<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
										in 7 languages
									</span>
								</h2>
								<p className="mb-6 leading-relaxed text-slate-400">
									Paste any JSON and export ready-to-use
									models — with nested types, preview before
									copying, and proper language-specific
									annotations.
								</p>
								{/* Language badges */}
								<div className="mb-8 flex flex-wrap gap-2">
									{exportLanguages.map((lang) => (
										<span
											key={lang.name}
											className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-300"
											style={{
												borderColor: `${lang.color}40`,
												background: `${lang.color}12`,
											}}>
											<span
												className="inline-block h-2 w-2 rounded-full"
												style={{
													background: lang.color,
												}}
											/>
											{lang.name}
											<span className="text-slate-500">
												·
											</span>
											<span
												style={{ color: lang.color }}
												className="opacity-80">
												{lang.badge}
											</span>
										</span>
									))}
								</div>
								<ul className="mb-8 space-y-3">
									{[
										"Preview modal before copying",
										"Nested object & array support",
										"Language-specific annotations",
										"Invalid keys automatically sanitized",
									].map((item) => (
										<li
											key={item}
											className="flex items-center gap-2.5 text-sm text-slate-300">
											<CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
											{item}
										</li>
									))}
								</ul>
								<Link
									href="/"
									className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105">
									Try Export Now{" "}
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
							{/* Right: code preview */}
							<div className="flex items-center p-6 lg:p-10">
								<div
									className="w-full overflow-hidden rounded-2xl"
									style={{
										background: "rgba(10,10,25,0.9)",
										border: "1px solid rgba(255,255,255,0.07)",
									}}>
									<div
										className="flex items-center justify-between border-b px-4 py-2.5"
										style={{
											borderColor:
												"rgba(255,255,255,0.07)",
										}}>
										<span className="text-xs text-slate-500">
											TypeScript Output
										</span>
										<button
											aria-label="Copy code"
											className="rounded p-1 hover:bg-white/10">
											<Copy className="h-3.5 w-3.5 text-slate-500" />
										</button>
									</div>
									<pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-300">{`export interface Model {
  name: string;
  age: number;
  active: boolean;
  address: ModelAddress;
}

export interface ModelAddress {
  city: string;
  zip: number;
}`}</pre>
									<div
										className="border-t px-4 py-2"
										style={{
											borderColor:
												"rgba(255,255,255,0.07)",
										}}>
										<div className="flex flex-wrap gap-1.5">
											{[
												"C# Class",
												"Java POJO",
												"Python Pydantic",
												"Go Struct",
											].map((lang) => (
												<span
													key={lang}
													className="rounded-md px-2 py-0.5 text-[10px] text-slate-500"
													style={{
														background:
															"rgba(255,255,255,0.05)",
														border: "1px solid rgba(255,255,255,0.08)",
													}}>
													{lang}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════ HOW IT WORKS ═══════════════ */}
			<section id="how-it-works" className="px-4 py-24">
				<div className="mx-auto max-w-6xl">
					<div className="mb-14 text-center">
						<p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-400">
							Workflow
						</p>
						<h2 className="text-4xl font-bold text-white md:text-5xl">
							Up and running in{" "}
							<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
								30 seconds
							</span>
						</h2>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{[
							{
								number: "01",
								icon: Layers,
								title: "Create a Tab",
								description:
									"Click New Tab, give it a name and start working instantly.",
							},
							{
								number: "02",
								icon: AlignLeft,
								title: "Paste Your JSON",
								description:
									"Drop any JSON into the CodeMirror editor. The formatted preview and validation update in real-time.",
							},
							{
								number: "03",
								icon: Download,
								title: "Analyze & Export",
								description:
									"Compare diffs, run JSONPath queries, visualize data in charts, and export to any of 7 languages.",
							},
						].map((step, i) => {
							const Icon = step.icon;
							return (
								<div
									key={i}
									className="relative flex flex-col items-start rounded-2xl p-7"
									style={{
										background: "rgba(255,255,255,0.03)",
										border: "1px solid rgba(255,255,255,0.08)",
									}}>
									<span
										className="mb-4 text-5xl font-black leading-none"
										style={{
											background:
												"linear-gradient(135deg, rgba(14,165,233,0.30) 0%, rgba(99,102,241,0.30) 100%)",
											WebkitBackgroundClip: "text",
											WebkitTextFillColor: "transparent",
										}}>
										{step.number}
									</span>
									<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600">
										<Icon className="h-5 w-5 text-white" />
									</div>
									<h3 className="mb-2 text-lg font-semibold text-white">
										{step.title}
									</h3>
									<p className="text-sm leading-relaxed text-slate-400">
										{step.description}
									</p>
									{i < 2 && (
										<div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 md:block">
											<ChevronRight className="h-5 w-5 text-slate-600" />
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ═══════════════ FINAL CTA ═══════════════ */}
			<section className="px-4 py-28">
				<div
					className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl px-10 py-16 text-center"
					style={{
						background:
							"linear-gradient(135deg, rgba(14,165,233,0.14) 0%, rgba(99,102,241,0.14) 100%)",
						border: "1px solid rgba(14,165,233,0.22)",
					}}>
					<div
						className="pointer-events-none absolute inset-0 -z-10"
						style={{
							background:
								"radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.25) 0%, transparent 70%)",
						}}
					/>
					<h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
						Ready to work smarter{" "}
						<span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
							with JSON?
						</span>
					</h2>
					<p className="mx-auto mb-10 max-w-md text-slate-400">
						No sign-up. No tracking. Open the editor and start
						building immediately.
					</p>
					<Link
						href="/"
						className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-10 py-4 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-sky-500/30">
						<FileJson className="h-5 w-5" />
						Open JSON Viewer — It&apos;s Free
						<ChevronRight className="h-5 w-5" />
					</Link>
				</div>
			</section>

			{/* ═══════════════ FOOTER ═══════════════ */}
			<footer
				className="border-t px-4 py-10"
				style={{ borderColor: "rgba(255,255,255,0.07)" }}>
				<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600">
							<Braces className="h-4 w-4 text-white" />
						</div>
						<span className="text-sm font-semibold text-slate-300">
							JSON Viewer
						</span>
					</div>
					<p className="text-xs text-slate-600">
						Built with Next.js · Tailwind CSS · CodeMirror ·
						Recharts · Deployed on Vercel
					</p>
					<div className="flex gap-5">
						<a
							href="https://github.com/congthien2003/multiple-json-viewer"
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs text-slate-500 transition-colors hover:text-slate-300">
							GitHub
						</a>
						<Link
							href="/"
							className="text-xs text-slate-500 transition-colors hover:text-slate-300">
							Launch App
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
