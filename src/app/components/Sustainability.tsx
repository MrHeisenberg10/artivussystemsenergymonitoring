import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import { Leaf, Sun, Wind, TrendingDown, Award, Globe, Zap, Droplets, TreePine } from "lucide-react";

const co2Monthly = [
  { month: "Jan", co2: 32.4, target: 28 }, { month: "Feb", co2: 29.8, target: 27 },
  { month: "Mar", co2: 31.2, target: 26 }, { month: "Apr", co2: 27.6, target: 25 },
  { month: "May", co2: 25.1, target: 24 }, { month: "Jun", co2: 18.4, target: 23 },
];

const renewableData = [
  { day: "Mon", solar: 86, wind: 0, grid: 14 }, { day: "Tue", solar: 78, wind: 0, grid: 22 },
  { day: "Wed", solar: 62, wind: 0, grid: 38 }, { day: "Thu", solar: 91, wind: 0, grid: 9 },
  { day: "Fri", solar: 84, wind: 0, grid: 16 }, { day: "Sat", solar: 95, wind: 0, grid: 5 },
  { day: "Sun", solar: 88, wind: 0, grid: 12 },
];

const energyMix = [
  { name: "Solar PV", value: 34, color: "#F59E0B" },
  { name: "Grid (Renewable)", value: 28, color: "#22C55E" },
  { name: "Grid (Standard)", value: 24, color: "#3B82F6" },
  { name: "Battery Storage", value: 14, color: "#8B5CF6" },
];

const carbonHistory = [
  { week: "W1", offset: 4.2, emission: 8.1 }, { week: "W2", offset: 5.1, emission: 7.8 },
  { week: "W3", offset: 4.8, emission: 7.4 }, { week: "W4", offset: 6.2, emission: 6.9 },
  { week: "W5", offset: 5.9, emission: 6.5 }, { week: "W6", offset: 6.8, emission: 5.8 },
  { week: "W7", offset: 7.1, emission: 5.2 }, { week: "W8", offset: 7.4, emission: 4.8 },
];

function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ background: "rgba(30,41,59,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

function CircularProgress({ value, max, color, size = 120, strokeWidth = 8, label, sublabel }: {
  value: number; max: number; color: string; size?: number; strokeWidth?: number; label: string; sublabel: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const progress = (value / max) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circ}`} strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ color, fontSize: 20, fontWeight: 700 }}>{value}</span>
          <span style={{ color: "#475569", fontSize: 10 }}>{sublabel}</span>
        </div>
      </div>
      <span style={{ color: "#94A3B8", fontSize: 12, textAlign: "center" }}>{label}</span>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#22C55E" : score >= 60 ? "#F59E0B" : "#EF4444";
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const progress = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <svg width="180" height="180">
        {/* Background rings */}
        <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle cx="90" cy="90" r={55} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
        {/* Score arc */}
        <circle
          cx="90" cy="90" r={radius} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${progress} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span style={{ color, fontSize: 36, fontWeight: 800 }}>{score}</span>
        <span style={{ color: "#94A3B8", fontSize: 12 }}>/ 100</span>
        <span style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>ESG Score</span>
      </div>
    </div>
  );
}

export function Sustainability() {
  const sustainScore = 82;

  return (
    <div className="p-6 flex flex-col gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Sustainability</h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>Environmental impact & green energy metrics · Raymond Textile Plant</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <Leaf size={14} color="#22C55E" />
          <span style={{ color: "#22C55E", fontSize: 13, fontWeight: 600 }}>Green Building Certified</span>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CO₂ This Month", value: "18.4 t", delta: "-43%", icon: <Globe size={18} />, color: "#22C55E", sub: "vs Jan baseline" },
          { label: "Carbon Avoided", value: "24.8 t", delta: "vs fossil", icon: <Leaf size={18} />, color: "#22C55E", sub: "Solar + renewables" },
          { label: "Renewable Share", value: "62%", delta: "+8% MoM", icon: <Sun size={18} />, color: "#F59E0B", sub: "of total energy" },
          { label: "Trees Equivalent", value: "412", delta: "carbon offset", icon: <TreePine size={18} />, color: "#22C55E", sub: "this year" },
        ].map((kpi) => (
          <GlassCard key={kpi.label} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}20`, color: kpi.color }}>
                {kpi.icon}
              </div>
              <span style={{ color: kpi.color, fontSize: 12, fontWeight: 600 }}>{kpi.delta}</span>
            </div>
            <div style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700 }}>{kpi.value}</div>
            <div style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>{kpi.label}</div>
            <div style={{ color: "#334155", fontSize: 11, marginTop: 1 }}>{kpi.sub}</div>
          </GlassCard>
        ))}
      </div>

      {/* Main row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sustainability scorecard */}
        <GlassCard className="p-6 flex flex-col items-center gap-6" style={{ border: "1px solid rgba(34,197,94,0.15)", background: "linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(30,41,59,0.7) 100%)" }}>
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, alignSelf: "flex-start" }}>Sustainability Score</h3>
          <ScoreRing score={sustainScore} />
          <div className="w-full flex flex-col gap-3">
            {[
              { label: "Energy Efficiency", value: 88, color: "#3B82F6" },
              { label: "Carbon Reduction", value: 76, color: "#22C55E" },
              { label: "Renewable Usage", value: 82, color: "#F59E0B" },
              { label: "Water Conservation", value: 71, color: "#8B5CF6" },
            ].map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: "#94A3B8", fontSize: 12 }}>{m.label}</span>
                  <span style={{ color: m.color, fontSize: 12, fontWeight: 600 }}>{m.value}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${m.value}%`, background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span style={{ color: "#64748B", fontSize: 12 }}>Grade</span>
            <span style={{ color: "#22C55E", fontSize: 16, fontWeight: 700 }}>A+ (Excellent)</span>
          </div>
        </GlassCard>

        {/* CO2 trend */}
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>CO₂ Emissions Tracking</h3>
              <p style={{ color: "#64748B", fontSize: 12, marginTop: 1 }}>Monthly emissions vs reduction target (tonnes)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#EF4444" }} /><span style={{ color: "#64748B", fontSize: 11 }}>Actual</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} /><span style={{ color: "#64748B", fontSize: 11 }}>Target</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={co2Monthly}>
              <defs>
                <linearGradient id="co2grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targetgrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="co2" name="CO₂ Emitted" stroke="#EF4444" strokeWidth={2} fill="url(#co2grad)" dot={{ fill: "#EF4444", r: 4 }} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#22C55E" strokeWidth={2} strokeDasharray="4 4" fill="url(#targetgrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          {/* Stats below */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {[
              { label: "YTD Reduction", value: "43.2%", color: "#22C55E" },
              { label: "vs Target", value: "-2.4t ahead", color: "#3B82F6" },
              { label: "Net Zero by", value: "2030", color: "#F59E0B" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div style={{ color: s.color, fontSize: 18, fontWeight: 700 }}>{s.value}</div>
                <div style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Renewable energy usage */}
        <GlassCard className="lg:col-span-2 p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Renewable Energy Usage</h3>
          <p style={{ color: "#64748B", fontSize: 12, marginBottom: 16 }}>Daily solar generation vs grid dependency (%)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={renewableData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="solar" name="Solar %" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="grid" name="Grid %" stackId="a" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Energy mix */}
        <GlassCard className="p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Energy Mix</h3>
          <p style={{ color: "#64748B", fontSize: 12, marginBottom: 8 }}>Source distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={energyMix} cx="50%" cy="50%" innerRadius={44} outerRadius={66} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                {energyMix.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            {energyMix.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span style={{ color: "#94A3B8", fontSize: 12 }}>{d.name}</span>
                </div>
                <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Carbon offset circular charts */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Environmental Impact Summary</h3>
            <p style={{ color: "#64748B", fontSize: 12, marginTop: 1 }}>Year-to-date achievements</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <Award size={14} color="#22C55E" />
            <span style={{ color: "#22C55E", fontSize: 12, fontWeight: 600 }}>On track for net-zero 2030</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <CircularProgress value={62} max={100} color="#F59E0B" label="Renewable Energy" sublabel="%" />
          <CircularProgress value={43} max={100} color="#22C55E" label="CO₂ Reduction" sublabel="%" />
          <CircularProgress value={78} max={100} color="#3B82F6" label="Energy Efficiency" sublabel="score" />
          <CircularProgress value={28} max={100} color="#8B5CF6" label="Carbon Offset" sublabel="t CO₂" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {[
            { icon: <Sun size={16} color="#F59E0B" />, label: "Solar Generated", value: "87.4 MWh", sub: "YTD" },
            { icon: <Droplets size={16} color="#3B82F6" />, label: "Water Saved", value: "2,840 L", sub: "vs baseline" },
            { icon: <TreePine size={16} color="#22C55E" />, label: "Carbon Equivalent", value: "412 trees", sub: "planted offset" },
            { icon: <TrendingDown size={16} color="#22C55E" />, label: "Waste Reduction", value: "31.4%", sub: "vs last year" },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <div style={{ color: "#F8FAFC", fontSize: 16, fontWeight: 700 }}>{item.value}</div>
                <div style={{ color: "#64748B", fontSize: 12 }}>{item.label}</div>
                <div style={{ color: "#334155", fontSize: 11, marginTop: 1 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
