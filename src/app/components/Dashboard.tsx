import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Zap, TrendingUp, Cpu, DollarSign, Wind, Leaf, AlertTriangle,
  ArrowUp, ArrowDown, ThumbsUp, Thermometer, Droplets, Activity, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { allDevices } from "./Devices";

const energyData = [
  { time: "00:00", usage: 42 }, { time: "02:00", usage: 38 },
  { time: "04:00", usage: 35 }, { time: "06:00", usage: 48 },
  { time: "08:00", usage: 72 }, { time: "10:00", usage: 88 },
  { time: "12:00", usage: 95 }, { time: "14:00", usage: 91 },
  { time: "16:00", usage: 85 }, { time: "18:00", usage: 78 },
  { time: "20:00", usage: 62 }, { time: "22:00", usage: 51 },
];

const floorData = [
  { floor: "Utility Plant", hvac: 12, lighting: 8, equipment: 15 },
  { floor: "Weaving Plant", hvac: 18, lighting: 12, equipment: 22 },
];

const deviceStatus = [
  { name: "Online", value: 1842, color: "#22C55E" },
  { name: "Idle", value: 654, color: "#3B82F6" },
  { name: "Warning", value: 218, color: "#F59E0B" },
  { name: "Offline", value: 133, color: "#EF4444" },
];

const weeklyData = [
  { day: "Mon", energy: 820, cost: 148 }, { day: "Tue", energy: 932, cost: 168 },
  { day: "Wed", energy: 901, cost: 162 }, { day: "Thu", energy: 1034, cost: 186 },
  { day: "Fri", energy: 968, cost: 174 }, { day: "Sat", energy: 612, cost: 110 },
  { day: "Sun", energy: 548, cost: 99 },
];

const alerts = [
  { id: 1, severity: "critical", title: "HVAC Unit 3 — Overheating", location: "Floor 4, Zone B", time: "2m ago", icon: <AlertTriangle size={14} /> },
  { id: 2, severity: "warning", title: "Load Threshold Exceeded", location: "Main Grid — Circuit 7", time: "8m ago", icon: <AlertCircle size={14} /> },
  { id: 3, severity: "warning", title: "Sensor Offline", location: "Basement Level 2", time: "15m ago", icon: <AlertCircle size={14} /> },
  { id: 4, severity: "info", title: "Maintenance Scheduled", location: "Chiller Unit 1", time: "1h ago", icon: <CheckCircle size={14} /> },
];

const allMappedDevices = allDevices.map(d => ({
  id: d.id,
  name: d.name,
  type: d.type,
  location: d.location,
  status: d.status,
  consumption: d.power === 0 ? "0 kW" : `${(d.power / 1000).toFixed(1)} kW`,
  uptime: `${d.uptime}%`
}));

const kpis = [
  { label: "Total Energy", value: "48.6 MWh", delta: "+2.4%", up: true, sub: "Today vs yesterday", color: "#3B82F6", icon: <Zap size={20} />, gradient: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))" },
  { label: "Current Load", value: "4.28 MW", delta: "-5.1%", up: false, sub: "vs peak capacity", color: "#22C55E", icon: <TrendingUp size={20} />, gradient: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))" },
  { label: "Active Devices", value: "2,847", delta: "+12", up: true, sub: "1,842 online now", color: "#8B5CF6", icon: <Cpu size={20} />, gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))" },
  { label: "Monthly Cost", value: "₹84,210", delta: "-8.3%", up: false, sub: "vs last month", color: "#F59E0B", icon: <DollarSign size={20} />, gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))" },
  { label: "CO₂ Emissions", value: "18.4 t", delta: "-12%", up: false, sub: "This month", color: "#22C55E", icon: <Leaf size={20} />, gradient: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))" },
  { label: "Energy Savings", value: "34.2%", delta: "+3.1%", up: true, sub: "vs baseline", color: "#3B82F6", icon: <Wind size={20} />, gradient: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-xl" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }}>
        <div style={{ color: "#94A3B8", marginBottom: 4 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}{p.dataKey === "cost" ? "₹" : " kWh"}</div>
        ))}
      </div>
    );
  }
  return null;
};

function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(30,41,59,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Dashboard() {
  const [showAllDevices, setShowAllDevices] = useState(false);
  const displayedDevices = showAllDevices ? allMappedDevices : allMappedDevices.slice(0, 6);

  return (
    <div className="p-6 flex flex-col gap-6" style={{ fontFamily: "'Inter', sans-serif", minHeight: "100%" }}>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Energy Overview</h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>Raymond Textile Plant · Real-time monitoring active</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span style={{ color: "#22C55E", fontSize: 12, fontWeight: 600 }}>LIVE</span>
          </div>
          <select className="px-3 py-1.5 rounded-lg outline-none" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8", fontSize: 13 }}>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <GlassCard key={kpi.label} className="p-4" style={{ background: kpi.gradient }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}20`, color: kpi.color }}>
                {kpi.icon}
              </div>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: kpi.up ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: kpi.up ? "#22C55E" : "#EF4444", fontSize: 11, fontWeight: 600 }}>
                {kpi.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                {kpi.delta}
              </span>
            </div>
            <div style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 700 }}>{kpi.value}</div>
            <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{kpi.label}</div>
            <div style={{ color: "#334155", fontSize: 11, marginTop: 1 }}>{kpi.sub}</div>
          </GlassCard>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Real-time line chart */}
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Real-time Energy Usage</h3>
              <p style={{ color: "#64748B", fontSize: 12, marginTop: 1 }}>Today's consumption</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ background: "#3B82F6" }} /><span style={{ color: "#64748B", fontSize: 11 }}>Actual</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="usage" name="Actual" stroke="#3B82F6" strokeWidth={2} fill="url(#blue)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Device status donut */}
        <GlassCard className="p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Device Status</h3>
          <p style={{ color: "#64748B", fontSize: 12, marginBottom: 16 }}>2,847 total devices</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deviceStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                {deviceStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any, n: any) => [v, n]} contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {deviceStatus.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span style={{ color: "#94A3B8", fontSize: 12 }}>{d.name}</span>
                </div>
                <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Plant-wise bar chart */}
        <GlassCard className="p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Plant-wise Consumption</h3>
          <p style={{ color: "#64748B", fontSize: 12, marginBottom: 16 }}>kWh breakdown by category</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={floorData} barSize={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="floor" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="hvac" name="HVAC" fill="#3B82F6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="lighting" name="Lighting" fill="#22C55E" radius={[3, 3, 0, 0]} />
              <Bar dataKey="equipment" name="Equipment" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Weekly analytics */}
        <GlassCard className="p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Weekly Overview</h3>
          <p style={{ color: "#64748B", fontSize: 12, marginBottom: 16 }}>Energy (kWh) and cost (₹
            )</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="energy" name="Energy (kWh)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" name="Cost (₹)" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Alerts panel */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Recent Alerts</h3>
            <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444", fontSize: 11, fontWeight: 600 }}>3 active</span>
          </div>
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${alert.severity === "critical" ? "rgba(239,68,68,0.2)" : alert.severity === "warning" ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.15)"}` }}>
                <div className="mt-0.5" style={{ color: alert.severity === "critical" ? "#EF4444" : alert.severity === "warning" ? "#F59E0B" : "#3B82F6" }}>
                  {alert.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>{alert.title}</div>
                  <div style={{ color: "#64748B", fontSize: 11, marginTop: 1 }}>{alert.location}</div>
                </div>
                <span style={{ color: "#475569", fontSize: 11, flexShrink: 0 }}>{alert.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Device table */}
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Device Activity</h3>
            <button onClick={() => setShowAllDevices(!showAllDevices)} className="px-3 py-1 rounded-lg text-sm" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6", fontSize: 12 }}>
              {showAllDevices ? "Show less" : "View all"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {["Device", "Type", "Location", "Status", "Load", "Uptime"].map(h => (
                    <th key={h} className="text-left pb-3" style={{ color: "#475569", fontSize: 11, fontWeight: 600, paddingRight: 16 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedDevices.map((d, i) => (
                  <tr key={d.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="py-3 pr-4">
                      <div style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 500 }}>{d.name}</div>
                      <div style={{ color: "#475569", fontSize: 11 }}>{d.id}</div>
                    </td>
                    <td className="py-3 pr-4" style={{ color: "#94A3B8", fontSize: 12 }}>{d.type}</td>
                    <td className="py-3 pr-4" style={{ color: "#94A3B8", fontSize: 12 }}>{d.location}</td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit" style={{
                        background: d.status === "online" ? "rgba(34,197,94,0.12)" : d.status === "warning" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                        color: d.status === "online" ? "#22C55E" : d.status === "warning" ? "#F59E0B" : "#EF4444",
                        fontSize: 11, fontWeight: 600
                      }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4" style={{ color: d.consumption.startsWith("-") ? "#22C55E" : "#F8FAFC", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>{d.consumption}</td>
                    <td className="py-3" style={{ color: "#94A3B8", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>{d.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* HVAC + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* HVAC Widget */}
        <GlassCard className="p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>HVAC Monitoring</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { zone: "Zone A — Lobby", temp: "21.4°C", humidity: "48%", status: "optimal", load: 72 },
              { zone: "Zone B — Office", temp: "22.1°C", humidity: "52%", status: "optimal", load: 85 },
              { zone: "Zone C — Server", temp: "18.5°C", humidity: "38%", status: "active", load: 95 },
              { zone: "Zone D — Parking", temp: "26.2°C", humidity: "61%", status: "warning", load: 45 },
            ].map((zone) => (
              <div key={zone.zone} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "#94A3B8", fontSize: 11, marginBottom: 8 }}>{zone.zone}</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Thermometer size={13} color="#3B82F6" />
                    <span style={{ color: "#F8FAFC", fontSize: 14, fontWeight: 600 }}>{zone.temp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets size={13} color="#22C55E" />
                    <span style={{ color: "#94A3B8", fontSize: 12 }}>{zone.humidity}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: "#475569", fontSize: 11 }}>Load</span>
                  <span style={{ color: zone.load > 90 ? "#F59E0B" : "#94A3B8", fontSize: 11 }}>{zone.load}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${zone.load}%`, background: zone.load > 90 ? "#F59E0B" : zone.load > 75 ? "#3B82F6" : "#22C55E" }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* System Status */}
        <GlassCard className="p-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Live System Status</h3>
          <div className="flex flex-col gap-3">
            {[
              { name: "Primary Grid", status: "Normal", value: "11.2 kV", ok: true },
              { name: "Backup Generator", status: "Standby", value: "Ready", ok: true },
              { name: "Solar Array", status: "Generating", value: "86.4 kW", ok: true },
              { name: "Battery Storage", status: "Charging", value: "74% SoC", ok: true },
              { name: "UPS System", status: "Online", value: "100% Charge", ok: true },
              { name: "Demand Response", status: "Active", value: "Event #7", ok: true },
              { name: "Network Switch", status: "Degraded", value: "3 ports down", ok: false },
              { name: "Data Logger", status: "Recording", value: "48K events/hr", ok: true },
            ].map((sys) => (
              <div key={sys.name} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: sys.ok ? "#22C55E" : "#EF4444" }} />
                  <span style={{ color: "#F8FAFC", fontSize: 13 }}>{sys.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span style={{ color: sys.ok ? "#22C55E" : "#EF4444", fontSize: 12 }}>{sys.status}</span>
                  <span style={{ color: "#475569", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", minWidth: 80, textAlign: "right" }}>{sys.value}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
