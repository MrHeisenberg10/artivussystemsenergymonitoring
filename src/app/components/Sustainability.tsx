import { useState, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import { Leaf, Sun, Wind, TrendingDown, Award, Globe, Zap, Droplets, TreePine } from "lucide-react";
import {
  calculateTotalCarbonFootprint,
  getTreeEquivalent,
  getEmissionBreakdown,
  EMISSION_FACTORS,
} from "../../utils/carbonFootprint";

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

  // Energy consumption inputs — editable so changes propagate to all calculations
  const [energyConsumption, setEnergyConsumption] = useState({
    electricity: 100000, // kWh - Monthly consumption
    diesel: 5000, // Liters - Monthly consumption
    petrol: 1000, // Liters - Monthly consumption
    lpg: 500, // kg - Monthly consumption
  });

  // Handler to update individual consumption fields
  const handleConsumptionChange = (field: keyof typeof energyConsumption, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setEnergyConsumption(prev => ({ ...prev, [field]: numValue }));
    }
  };

  // Calculate carbon emissions from current consumption inputs
  const carbonEmissions = useMemo(() => {
    return calculateTotalCarbonFootprint(energyConsumption);
  }, [energyConsumption]);

  // Compute CO₂ reduction percentage relative to a 100 t baseline (dynamic)
  const co2ReductionPercent = useMemo(() => {
    // Ensure the baseline is not zero to avoid division by zero
    const baseline = 100; // tonnes – arbitrary baseline for 100 % reduction target
    const reduction = Math.max(0, Math.round((1 - carbonEmissions.total.emissionsTonnes / baseline) * 100));
    return reduction;
  }, [carbonEmissions.total.emissionsTonnes]);

  // Compute Energy Efficiency as average solar generation percentage from renewableData
  const energyEfficiencyPercent = useMemo(() => {
    const totalSolar = renewableData.reduce((sum, d) => sum + d.solar, 0);
    const avgSolar = Math.round(totalSolar / renewableData.length);
    return avgSolar;
  }, []);


  // Get tree equivalent for carbon offset visualization
  const treeEquivalent = useMemo(() => {
    return getTreeEquivalent(carbonEmissions.total.emissionsTonnes);
  }, [carbonEmissions]);

  // Get emission breakdown percentages
  const emissionBreakdown = useMemo(() => {
    return getEmissionBreakdown(carbonEmissions);
  }, [carbonEmissions]);

  // Shared input styles for the editable fields
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', 'Inter', monospace",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    marginTop: 6,
  };

  const inputFocusHandler = (e: React.FocusEvent<HTMLInputElement>, color: string) => {
    e.target.style.borderColor = color;
    e.target.style.boxShadow = `0 0 0 2px ${color}30`;
  };

  const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.12)";
    e.target.style.boxShadow = "none";
  };

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
          { label: "CO₂ This Month", value: `${carbonEmissions.total.emissionsTonnes.toFixed(1)} t`, delta: `${co2ReductionPercent}%`, icon: <Globe size={18} />, color: "#22C55E", sub: "tCO₂e" },
          { label: "Electricity Impact", value: `${carbonEmissions.electricity.emissionsTonnes.toFixed(1)} t`, delta: `${emissionBreakdown.electricity}%`, icon: <Zap size={18} />, color: "#3B82F6", sub: "of total" },
          { label: "Fuel Impact", value: `${(carbonEmissions.diesel.emissionsTonnes + carbonEmissions.petrol.emissionsTonnes).toFixed(1)} t`, delta: `${(Number(emissionBreakdown.diesel) + Number(emissionBreakdown.petrol)).toFixed(1)}%`, icon: <Wind size={18} />, color: "#F59E0B", sub: "diesel + petrol" },
          { label: "Trees Equivalent", value: `${treeEquivalent}`, delta: "carbon offset", icon: <TreePine size={18} />, color: "#22C55E", sub: "trees planted offset" },
        ].map((kpi) => (
          <GlassCard key={kpi.label} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}20`, color: kpi.color }}>
                {kpi.icon}
              </div>
              <span style={{ color: kpi.color, fontSize: 12, fontWeight: 600 }}>{kpi.delta}</span>
            </div>
            <div style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700 }}>{kpi.value}</div>
            <div style={{ color: "#F8FAFC", fontSize: 12, marginTop: 2 }}>{kpi.label}</div>
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

      {/* Carbon Footprint Calculation with EDITABLE INPUTS */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Carbon Footprint Calculation - Indian Standards</h3>
            <p style={{ color: "#64748B", fontSize: 12, marginTop: 1 }}>Energy consumption × Emission factors (kg CO₂e/unit)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <Zap size={14} color="#60A5FA" />
          <span style={{ color: "#93C5FD", fontSize: 12 }}>Edit the consumption values below — all KPIs &amp; sustainability metrics update automatically</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Electricity */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(59,130,246,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} color="#3B82F6" />
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>Electricity</span>
            </div>
            <div style={{ color: "#3B82F6", fontSize: 18, fontWeight: 700 }}>{carbonEmissions.electricity.emissionsTonnes.toFixed(1)}</div>
            <div style={{ color: "#64748B", fontSize: 10, marginTop: 1 }}>tCO₂e</div>
            <div style={{ marginTop: 8 }}>
              <label style={{ color: "#94A3B8", fontSize: 10, fontWeight: 500 }}>Consumption (kWh)</label>
              <input
                id="input-electricity"
                type="number"
                min="0"
                value={energyConsumption.electricity}
                onChange={(e) => handleConsumptionChange("electricity", e.target.value)}
                onFocus={(e) => inputFocusHandler(e, "#3B82F6")}
                onBlur={inputBlurHandler}
                style={inputStyle}
              />
            </div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 6 }}>
              {energyConsumption.electricity.toLocaleString()} × {EMISSION_FACTORS.ELECTRICITY} = {carbonEmissions.electricity.emissions.toFixed(0)} kg
            </div>
          </div>

          {/* Diesel */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Droplets size={16} color="#EF4444" />
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>Diesel</span>
            </div>
            <div style={{ color: "#EF4444", fontSize: 18, fontWeight: 700 }}>{carbonEmissions.diesel.emissionsTonnes.toFixed(1)}</div>
            <div style={{ color: "#64748B", fontSize: 10, marginTop: 1 }}>tCO₂e</div>
            <div style={{ marginTop: 8 }}>
              <label style={{ color: "#94A3B8", fontSize: 10, fontWeight: 500 }}>Consumption (Liters)</label>
              <input
                id="input-diesel"
                type="number"
                min="0"
                value={energyConsumption.diesel}
                onChange={(e) => handleConsumptionChange("diesel", e.target.value)}
                onFocus={(e) => inputFocusHandler(e, "#EF4444")}
                onBlur={inputBlurHandler}
                style={inputStyle}
              />
            </div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 6 }}>
              {energyConsumption.diesel.toLocaleString()} L × {EMISSION_FACTORS.DIESEL} = {carbonEmissions.diesel.emissions.toFixed(0)} kg
            </div>
          </div>

          {/* Petrol */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Wind size={16} color="#F59E0B" />
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>Petrol</span>
            </div>
            <div style={{ color: "#F59E0B", fontSize: 18, fontWeight: 700 }}>{carbonEmissions.petrol.emissionsTonnes.toFixed(1)}</div>
            <div style={{ color: "#64748B", fontSize: 10, marginTop: 1 }}>tCO₂e</div>
            <div style={{ marginTop: 8 }}>
              <label style={{ color: "#94A3B8", fontSize: 10, fontWeight: 500 }}>Consumption (Liters)</label>
              <input
                id="input-petrol"
                type="number"
                min="0"
                value={energyConsumption.petrol}
                onChange={(e) => handleConsumptionChange("petrol", e.target.value)}
                onFocus={(e) => inputFocusHandler(e, "#F59E0B")}
                onBlur={inputBlurHandler}
                style={inputStyle}
              />
            </div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 6 }}>
              {energyConsumption.petrol.toLocaleString()} L × {EMISSION_FACTORS.PETROL} = {carbonEmissions.petrol.emissions.toFixed(0)} kg
            </div>
          </div>

          {/* LPG */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Sun size={16} color="#8B5CF6" />
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>LPG</span>
            </div>
            <div style={{ color: "#8B5CF6", fontSize: 18, fontWeight: 700 }}>{carbonEmissions.lpg.emissionsTonnes.toFixed(1)}</div>
            <div style={{ color: "#64748B", fontSize: 10, marginTop: 1 }}>tCO₂e</div>
            <div style={{ marginTop: 8 }}>
              <label style={{ color: "#94A3B8", fontSize: 10, fontWeight: 500 }}>Consumption (kg)</label>
              <input
                id="input-lpg"
                type="number"
                min="0"
                value={energyConsumption.lpg}
                onChange={(e) => handleConsumptionChange("lpg", e.target.value)}
                onFocus={(e) => inputFocusHandler(e, "#8B5CF6")}
                onBlur={inputBlurHandler}
                style={inputStyle}
              />
            </div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 6 }}>
              {energyConsumption.lpg.toLocaleString()} kg × {EMISSION_FACTORS.LPG} = {carbonEmissions.lpg.emissions.toFixed(0)} kg
            </div>
          </div>

          {/* Total */}
          <div className="p-4 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(30,41,59,0.7) 100%)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} color="#22C55E" />
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>Total</span>
            </div>
            <div style={{ color: "#22C55E", fontSize: 24, fontWeight: 800 }}>{carbonEmissions.total.emissionsTonnes.toFixed(1)}</div>
            <div style={{ color: "#64748B", fontSize: 10, marginTop: 1 }}>tCO₂e</div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 8 }}>
              Monthly carbon footprint
            </div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 1 }}>
              (Indian Standards)
            </div>
            <div style={{ color: "#22C55E", fontSize: 10, marginTop: 6, fontWeight: 600 }}>
              ≈ {treeEquivalent} trees to offset
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Environmental Impact Summary */}
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
          <CircularProgress value={co2ReductionPercent} max={100} color="#22C55E" label="CO₂ Reduction" sublabel="%" />
          <CircularProgress value={energyEfficiencyPercent} max={100} color="#3B82F6" label="Energy Efficiency" sublabel="score" />
          <CircularProgress value={Math.round((carbonEmissions.total.emissionsTonnes / 100) * 100)} max={100} color="#8B5CF6" label="Carbon Footprint" sublabel="t CO₂e/mo" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {[
            { icon: <Zap size={16} color="#3B82F6" />, label: "Electricity Emissions", value: `${carbonEmissions.electricity.emissionsTonnes.toFixed(1)} t`, sub: "kWh consumption" },
            { icon: <Droplets size={16} color="#EF4444" />, label: "Fuel Emissions", value: `${(carbonEmissions.diesel.emissionsTonnes + carbonEmissions.petrol.emissionsTonnes + carbonEmissions.lpg.emissionsTonnes).toFixed(1)} t`, sub: "diesel + petrol + LPG" },
            { icon: <TreePine size={16} color="#22C55E" />, label: "Carbon Equivalent", value: `${treeEquivalent} trees`, sub: "planted offset" },
            { icon: <TrendingDown size={16} color="#22C55E" />, label: "Emission Reduction", value: "31.4%", sub: "vs last year" },
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
