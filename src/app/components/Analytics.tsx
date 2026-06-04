import { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from "recharts";
import { Download, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react";

const dailyData = [
  { hour: "00", consumption: 38, solar: 0, grid: 38 },
  { hour: "02", consumption: 34, solar: 0, grid: 34 },
  { hour: "04", consumption: 31, solar: 0, grid: 31 },
  { hour: "06", consumption: 45, solar: 8, grid: 37 },
  { hour: "08", consumption: 74, solar: 24, grid: 50 },
  { hour: "10", consumption: 92, solar: 38, grid: 54 },
  { hour: "12", consumption: 98, solar: 45, grid: 53 },
  { hour: "14", consumption: 94, solar: 41, grid: 53 },
  { hour: "16", consumption: 88, solar: 28, grid: 60 },
  { hour: "18", consumption: 82, solar: 12, grid: 70 },
  { hour: "20", consumption: 68, solar: 0, grid: 68 },
  { hour: "22", consumption: 52, solar: 0, grid: 52 },
];

const weeklyData = [
  { day: "Mon", energy: 820, prev: 870 }, { day: "Tue", energy: 932, prev: 950 },
  { day: "Wed", energy: 901, prev: 920 }, { day: "Thu", energy: 1034, prev: 980 },
  { day: "Fri", energy: 968, prev: 1010 }, { day: "Sat", energy: 612, prev: 640 },
  { day: "Sun", energy: 548, prev: 580 },
];

const monthlyData = [
  { month: "Jan", current: 28400, prev: 31200 }, { month: "Feb", current: 25800, prev: 29400 },
  { month: "Mar", current: 27200, prev: 30100 }, { month: "Apr", current: 24600, prev: 28800 },
  { month: "May", current: 26800, prev: 29600 }, { month: "Jun", current: 29400, prev: 32100 },
  { month: "Jul", current: 31200, prev: 34500 }, { month: "Aug", current: 30800, prev: 33800 },
  { month: "Sep", current: 27400, prev: 30200 }, { month: "Oct", current: 25200, prev: 27800 },
  { month: "Nov", current: 23800, prev: 26400 }, { month: "Dec", current: 22600, prev: 25200 },
];

const peakData = [
  { time: "06", load: 42 }, { time: "07", load: 58 }, { time: "08", load: 74 },
  { time: "09", load: 85 }, { time: "10", load: 92 }, { time: "11", load: 96 },
  { time: "12", load: 98 }, { time: "13", load: 97 }, { time: "14", load: 94 },
  { time: "15", load: 91 }, { time: "16", load: 88 }, { time: "17", load: 84 },
  { time: "18", load: 78 }, { time: "19", load: 71 }, { time: "20", load: 62 },
];

const distributionData = [
  { name: "HVAC", value: 38, color: "#3B82F6" },
  { name: "Lighting", value: 18, color: "#22C55E" },
  { name: "Equipment", value: 28, color: "#8B5CF6" },
  { name: "IT Systems", value: 10, color: "#F59E0B" },
  { name: "Other", value: 6, color: "#64748B" },
];

function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ background: "rgba(30,41,59,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-xl" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }}>
        <div style={{ color: "#94A3B8", marginBottom: 4 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: "#F8FAFC" }}>{p.name}: {p.value} kWh</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function Analytics() {
  const [period, setPeriod] = useState("day");

  const stats = [
    { label: "Peak Demand", value: "98 kW", delta: "12:00 today", color: "#EF4444", trend: "up" },
    { label: "Avg Daily", value: "68.4 kWh", delta: "-4.2% vs last week", color: "#3B82F6", trend: "down" },
    { label: "Solar Yield", value: "196 kWh", delta: "22% of total", color: "#22C55E", trend: "up" },
    { label: "Grid Import", value: "604 kWh", delta: "-8.1% vs yesterday", color: "#F59E0B", trend: "down" },
  ];

  return (
    <div className="p-6 flex flex-col gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Analytics</h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>Advanced energy intelligence · Building Complex A</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {["day", "week", "month", "year"].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-4 py-2 capitalize transition-all"
                style={{
                  background: period === p ? "#3B82F6" : "#1E293B",
                  color: period === p ? "#fff" : "#94A3B8",
                  fontSize: 13,
                  fontWeight: period === p ? 600 : 400,
                }}
              >{p}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "#1E293B", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)", fontSize: 13 }}>
            <Filter size={14} />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6", fontSize: 13, fontWeight: 500 }}>
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-4">
            <div style={{ color: "#64748B", fontSize: 12, marginBottom: 8 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {s.trend === "up" ? <TrendingUp size={12} color={s.color} /> : <TrendingDown size={12} color="#22C55E" />}
              <span style={{ color: "#64748B", fontSize: 11 }}>{s.delta}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main chart + distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Daily Energy Usage</h3>
              <p style={{ color: "#64748B", fontSize: 12, marginTop: 1 }}>Consumption, solar generation & grid import (kWh)</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {[{ color: "#3B82F6", label: "Total" }, { color: "#22C55E", label: "Solar" }, { color: "#8B5CF6", label: "Grid" }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                  <span style={{ color: "#64748B", fontSize: 11 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={dailyData}>
              <defs>
                {[["consumption", "#3B82F6"], ["solar", "#22C55E"], ["grid", "#8B5CF6"]].map(([k, c]) => (
                  <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c as string} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={c as string} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tickFormatter={v => `${v}:00`} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="consumption" name="Total" stroke="#3B82F6" strokeWidth={2} fill="url(#grad-consumption)" dot={false} />
              <Area type="monotone" dataKey="solar" name="Solar" stroke="#22C55E" strokeWidth={2} fill="url(#grad-solar)" dot={false} />
              <Area type="monotone" dataKey="grid" name="Grid" stroke="#8B5CF6" strokeWidth={2} fill="url(#grad-grid)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Distribution pie */}
        <GlassCard className="p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Energy Distribution</h3>
          <p style={{ color: "#64748B", fontSize: 12, marginBottom: 12 }}>By system category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={distributionData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                {distributionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            {distributionData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                  <span style={{ color: "#94A3B8", fontSize: 12 }}>{d.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${d.value * 2.5}%`, background: d.color }} />
                  </div>
                  <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600, minWidth: 28 }}>{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Peak load + weekly + monthly */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Peak load */}
        <GlassCard className="p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Peak Load Analysis</h3>
          <p style={{ color: "#64748B", fontSize: 12, marginBottom: 16 }}>Today's load profile (kW)</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={peakData}>
              <defs>
                <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tickFormatter={v => `${v}:00`} tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
              <ReferenceLine y={90} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: "Threshold", fill: "#F59E0B", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="load" name="Load (kW)" stroke="#EF4444" strokeWidth={2} fill="url(#peakGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Weekly comparison */}
        <GlassCard className="p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Weekly Trends</h3>
          <p style={{ color: "#64748B", fontSize: 12, marginBottom: 16 }}>This week vs last week</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="energy" name="This Week" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6", r: 3 }} />
              <Line type="monotone" dataKey="prev" name="Last Week" stroke="#334155" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Monthly comparison */}
        <GlassCard className="p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Monthly Comparison</h3>
          <p style={{ color: "#64748B", fontSize: 12, marginBottom: 16 }}>2024 vs 2023 (kWh)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="current" name="2024" fill="#3B82F6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="prev" name="2023" fill="#334155" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Export report panel */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Export Reports</h3>
            <p style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>Generate detailed reports for the selected period</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: "Energy Summary", format: "PDF" },
              { label: "Device Report", format: "CSV" },
              { label: "Cost Analysis", format: "XLSX" },
              { label: "API Export", format: "JSON" },
            ].map(r => (
              <button
                key={r.label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8", fontSize: 13 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.4)"; (e.currentTarget as HTMLElement).style.color = "#3B82F6"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#94A3B8"; }}
              >
                <Download size={13} />
                {r.label}
                <span className="px-1.5 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.2)", color: "#3B82F6", fontSize: 10, fontWeight: 600 }}>{r.format}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
