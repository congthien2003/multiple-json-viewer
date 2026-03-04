import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  Palette,
  Zap,
  Shield,
  Code2,
  Copy,
  ChevronRight,
  Star,
  FileJson,
  ArrowRight,
  CheckCircle2,
  Braces,
  LayoutGrid,
  AlignLeft,
  Download,
} from "lucide-react";

export const metadata: Metadata = {
  title: "JSON Viewer — Advanced Multi-Tab JSON Editor",
  description:
    "A modern, feature-rich JSON viewer. Multi-tab support, syntax highlighting, real-time validation, and export to C# / TypeScript.",
};

// ─────────────────────────── DATA ─────────────────────────────

const features = [
  {
    icon: Layers,
    title: "Multi-Tab Support",
    description:
      "Manage multiple JSON documents simultaneously with persistent LocalStorage — no cloud required.",
    accent: "from-indigo-500 to-purple-600",
    size: "large",
  },
  {
    icon: Palette,
    title: "4 Beautiful Themes",
    description: "Light, Dark, Monokai, Dracula — switch in one click.",
    accent: "from-purple-500 to-fuchsia-600",
    size: "small",
  },
  {
    icon: Zap,
    title: "Real-Time Validation",
    description: "Instant JSON validation with human-readable error messages as you type.",
    accent: "from-blue-500 to-cyan-500",
    size: "small",
  },
  {
    icon: Code2,
    title: "Export to C# & TypeScript",
    description:
      "Generate strongly-typed models from any JSON with one click. Supports nested objects and arrays.",
    accent: "from-violet-500 to-indigo-600",
    size: "large",
  },
  {
    icon: Shield,
    title: "100% Private",
    description: "Your data never leaves the browser. No tracking. No cloud sync unless you opt in.",
    accent: "from-emerald-500 to-teal-600",
    size: "small",
  },
  {
    icon: LayoutGrid,
    title: "Collapsible Tree View",
    description: "Expand & collapse nested objects and arrays in the formatted preview panel.",
    accent: "from-sky-500 to-blue-600",
    size: "small",
  },
];

const steps = [
  {
    number: "01",
    title: "Create a Tab",
    description: "Click New Tab, give it a name and start working instantly.",
    icon: Layers,
  },
  {
    number: "02",
    title: "Paste Your JSON",
    description: "Drop any JSON into the editor. The preview panel updates in real-time.",
    icon: AlignLeft,
  },
  {
    number: "03",
    title: "Format, Validate & Export",
    description: "One-click format, minify, copy, or export as C# / TypeScript models.",
    icon: Download,
  },
];

const themes = [
  { name: "Light", bg: "bg-white", text: "text-slate-900", border: "border-slate-200", badge: "bg-slate-100 text-slate-700" },
  { name: "Dark", bg: "bg-slate-900", text: "text-slate-50", border: "border-slate-700", badge: "bg-slate-800 text-slate-300" },
  { name: "Monokai", bg: "bg-[#272822]", text: "text-[#f8f8f2]", border: "border-[#75715e]/40", badge: "bg-[#3e3d32] text-[#a6e22e]" },
  { name: "Dracula", bg: "bg-[#282a36]", text: "text-[#f8f8f2]", border: "border-[#6272a4]/40", badge: "bg-[#44475a] text-[#bd93f9]" },
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
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, oklch(0.10 0.015 280) 0%, oklch(0.08 0.01 260) 100%)" }}>

      {/* ── Background orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <header className="animate-slideDown fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl rounded-2xl" style={{ background: "rgba(15,15,30,0.75)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" aria-label="JSON Viewer home" className="flex items-center gap-3 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <Braces className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
              JSON Viewer
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            <a href="#features" className="text-sm text-slate-400 transition-colors duration-200 hover:text-white cursor-pointer">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-400 transition-colors duration-200 hover:text-white cursor-pointer">How it works</a>
            <a href="#themes" className="text-sm text-slate-400 transition-colors duration-200 hover:text-white cursor-pointer">Themes</a>
          </nav>

          {/* CTA */}
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-indigo-500/30"
          >
            Launch App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-20 text-center">
        {/* Badge */}
        <div className="animate-fadeIn mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-indigo-300" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
          <Star className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" />
          Free & Open Source
        </div>

        {/* Headline */}
        <h1 className="animate-slideUp mx-auto mb-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
          The{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            JSON editor
          </span>{" "}
          developers love
        </h1>

        {/* Sub-headline */}
        <p className="animate-fadeIn mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
          Multi-tab JSON editing with real-time validation, syntax highlighting, and one-click export to{" "}
          <span className="text-indigo-300 font-medium">C#</span> &amp;{" "}
          <span className="text-purple-300 font-medium">TypeScript</span> models.
        </p>

        {/* CTA row */}
        <div className="animate-fadeIn flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40"
          >
            <FileJson className="h-5 w-5" />
            Open JSON Viewer
            <ChevronRight className="h-4 w-4" />
          </Link>
          <a
            href="https://github.com/congthien2003/multiple-json-viewer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-2 rounded-2xl px-8 py-3.5 text-base font-semibold text-slate-300 transition-all duration-200 hover:text-white"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            View on GitHub
          </a>
        </div>

        {/* App preview mockup */}
        <div className="animate-fadeIn relative mx-auto mt-20 w-full max-w-4xl">
          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: "rgba(20,20,40,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <div className="ml-4 flex gap-2">
                <div className="rounded-md px-3 py-1 text-xs text-slate-300" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
                  user.json
                </div>
                <div className="rounded-md px-3 py-1 text-xs text-slate-500" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  config.json
                </div>
              </div>
            </div>
            {/* Two-panel layout */}
            <div className="grid grid-cols-2 gap-0 text-left">
              {/* Input panel */}
              <div className="border-r p-5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <p className="mb-2 text-xs font-medium text-slate-500">JSON Input</p>
                <pre className="font-mono text-xs leading-relaxed text-slate-300">{jsonSample}</pre>
              </div>
              {/* Preview panel */}
              <div className="p-5">
                <p className="mb-2 text-xs font-medium text-slate-500">JSON Preview</p>
                <div className="space-y-1 font-mono text-xs leading-relaxed">
                  <span className="text-slate-400">{"{"}</span>
                  <div className="pl-4"><span className="text-blue-400">&quot;name&quot;</span><span className="text-slate-400">: </span><span className="text-green-400">&quot;Alice&quot;</span><span className="text-slate-400">,</span></div>
                  <div className="pl-4"><span className="text-blue-400">&quot;age&quot;</span><span className="text-slate-400">: </span><span className="text-orange-400">28</span><span className="text-slate-400">,</span></div>
                  <div className="pl-4"><span className="text-blue-400">&quot;active&quot;</span><span className="text-slate-400">: </span><span className="text-red-400">true</span><span className="text-slate-400">,</span></div>
                  <div className="pl-4"><span className="text-blue-400">&quot;address&quot;</span><span className="text-slate-400">: {"{"}</span></div>
                  <div className="pl-8"><span className="text-blue-400">&quot;city&quot;</span><span className="text-slate-400">: </span><span className="text-green-400">&quot;HCM&quot;</span><span className="text-slate-400">,</span></div>
                  <div className="pl-8"><span className="text-blue-400">&quot;zip&quot;</span><span className="text-slate-400">: </span><span className="text-orange-400">70000</span></div>
                  <div className="pl-4"><span className="text-slate-400">{"}"}</span></div>
                  <span className="text-slate-400">{"}"}</span>
                </div>
              </div>
            </div>
            {/* Status bar */}
            <div className="flex items-center gap-4 border-t px-5 py-2 text-xs text-slate-500" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Valid JSON
              </span>
              <span>6 keys · 2 levels</span>
              <span className="ml-auto">120 chars</span>
            </div>
          </div>
          {/* Glow underneath */}
          <div className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl opacity-30 blur-2xl" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.4) 100%)" }} />
        </div>
      </section>

      {/* ═══════════════ FEATURES BENTO ═══════════════ */}
      <section id="features" className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-400">Features</p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Everything you need,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                nothing you don't
              </span>
            </h2>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`group relative cursor-default overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${feature.size === "large" ? "md:col-span-2" : ""}`}
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(8px)" }}
                >
                  {/* Icon */}
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
                  {/* Hover glow */}
                  <div className={`pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${feature.accent} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-10`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-purple-400">Workflow</p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Up and running in{" "}
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                30 seconds
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative flex flex-col items-start rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  {/* Step number */}
                  <span className="mb-4 text-5xl font-black leading-none" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.25) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {step.number}
                  </span>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{step.description}</p>
                  {/* Connector */}
                  {i < steps.length - 1 && (
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

      {/* ═══════════════ THEME SHOWCASE ═══════════════ */}
      <section id="themes" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-fuchsia-400">Themes</p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Pick your{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                perfect style
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-slate-400">
              4 hand-crafted color themes. Switch any time — your preference is saved automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {themes.map((theme) => (
              <div
                key={theme.name}
                className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.bg} ${theme.border}`}
              >
                {/* Fake window bar */}
                <div className={`flex items-center gap-1.5 border-b px-3 py-2.5 ${theme.border}`}>
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  <span className={`ml-2 text-xs ${theme.text} opacity-60`}>{theme.name}</span>
                </div>
                {/* Mini code */}
                <div className="p-4">
                  <div className="mb-3 space-y-1 font-mono text-xs">
                    <div className={`${theme.text} opacity-60`}>{"{"}</div>
                    <div className="pl-3">
                      <span className="text-blue-400">&quot;key&quot;</span>
                      <span className={`${theme.text} opacity-60`}>: </span>
                      <span className="text-green-400">&quot;value&quot;</span>
                    </div>
                    <div className={`${theme.text} opacity-60`}>{"}"}</div>
                  </div>
                  <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-medium ${theme.badge}`}>
                    {theme.name} theme
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ EXPORT SHOWCASE ═══════════════ */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.12) 100%)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
              {/* Left: copy */}
              <div className="p-10 lg:p-14">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Code2 className="h-7 w-7 text-white" />
                </div>
                  <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                  Generate typed models{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    instantly
                  </span>
                </h2>
                <p className="mb-6 text-slate-400 leading-relaxed">
                  Paste any JSON and export ready-to-use C# classes or TypeScript interfaces — with proper annotations and nested types.
                </p>
                <ul className="space-y-3">
                  {[
                    "C# with [JsonPropertyName] attributes",
                    "TypeScript export interface",
                    "Nested object support",
                    "Invalid keys automatically skipped",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/"
                  className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
                >
                  Try it now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {/* Right: code preview */}
              <div className="flex items-center p-6 lg:p-10">
                <div className="w-full overflow-hidden rounded-2xl" style={{ background: "rgba(15,15,30,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {/* Header */}
                  <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <span className="text-xs text-slate-500">TypeScript Output</span>
                    <button aria-label="Copy code to clipboard" className="cursor-pointer rounded p-1 transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
                      <Copy className="h-3.5 w-3.5 text-slate-500 hover:text-slate-300" />
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ KEYBOARD SHORTCUTS ═══════════════ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-8 text-3xl font-bold text-white">Built for keyboard-first developers</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { keys: ["Ctrl", "N"], description: "Create a new tab" },
              { keys: ["Ctrl", "T"], description: "Toggle Raw / Formatted view" },
            ].map((shortcut, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl px-5 py-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-sm text-slate-400">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((k) => (
                    <kbd key={k} className="rounded-md px-2.5 py-1 text-xs font-mono font-semibold text-slate-300" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="px-4 py-28">
        <div
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl px-10 py-16 text-center"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.18) 100%)", border: "1px solid rgba(139,92,246,0.25)" }}
        >
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.35) 0%, transparent 70%)" }} />
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Ready to work smarter{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              with JSON?
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-md text-slate-400">
            No sign-up required. Open the editor and start building immediately.
          </p>
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-10 py-4 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40"
          >
            <FileJson className="h-5 w-5" />
            Open JSON Viewer — It's Free
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t px-4 py-10" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <Braces className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-300">JSON Viewer</span>
          </div>
          <p className="text-xs text-slate-600">
            Built with Next.js · Tailwind CSS · Shadcn UI · Deployed on Vercel
          </p>
          <div className="flex gap-5">
            <a href="https://github.com/congthien2003/multiple-json-viewer" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 transition-colors duration-200 hover:text-slate-300 cursor-pointer">
              GitHub
            </a>
            <Link href="/" className="text-xs text-slate-500 transition-colors duration-200 hover:text-slate-300 cursor-pointer">
              Launch App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
