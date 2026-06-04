import { useState } from "react";
import { Search, Filter, RefreshCw, Wifi, WifiOff, AlertTriangle, Thermometer, Zap, Activity, Cpu, Wind, Sun, Battery } from "lucide-react";

const allDevices = [
  { id: "DEV-001", name: "HVAC Unit 1", type: "HVAC", location: "Floor 1 · Zone A", status: "online", voltage: 220.4, current: 18.2, temp: 21.4, power: 4012, health: 94, uptime: 99.8, lastSeen: "Just now" },
  { id: "DEV-002", name: "HVAC Unit 2", type: "HVAC", location: "Floor 2 · Zone B", status: "online", voltage: 219.8, current: 16.5, temp: 22.1, power: 3627, health: 88, uptime: 98.4, lastSeen: "Just now" },
  { id: "DEV-003", name: "HVAC Unit 3", type: "HVAC", location: "Floor 4 · Zone B", status: "warning", voltage: 218.2, current: 22.8, temp: 34.8, power: 4982, health: 52, uptime: 91.2, lastSeen: "2m ago" },
  { id: "DEV-004", name: "Chiller #1", type: "Cooling", location: "Rooftop", status: "online", voltage: 380.0, current: 28.4, temp: 12.2, power: 10792, health: 96, uptime: 99.9, lastSeen: "Just now" },
  { id: "DEV-005", name: "Chiller #2", type: "Cooling", location: "Rooftop", status: "warning", voltage: 374.3, current: 31.2, temp: 28.4, power: 11678, health: 61, uptime: 94.2, lastSeen: "8m ago" },
  { id: "DEV-006", name: "LED Array B1", type: "Lighting", location: "Basement L1", status: "online", voltage: 110.0, current: 7.3, temp: 28.5, power: 803, health: 100, uptime: 100, lastSeen: "Just now" },
  { id: "DEV-007", name: "LED Array B2", type: "Lighting", location: "Basement L2", status: "online", voltage: 110.2, current: 7.1, temp: 27.8, power: 782, health: 99, uptime: 100, lastSeen: "Just now" },
  { id: "DEV-008", name: "LED Array G", type: "Lighting", location: "Ground Floor", status: "online", voltage: 110.0, current: 12.4, temp: 30.2, power: 1364, health: 97, uptime: 99.6, lastSeen: "Just now" },
  { id: "DEV-009", name: "Solar Inverter", type: "Renewable", location: "Rooftop", status: "online", voltage: 400.0, current: -21.5, temp: 38.1, power: -8600, health: 92, uptime: 99.1, lastSeen: "Just now" },
  { id: "DEV-010", name: "Battery Bank 1", type: "Storage", location: "Basement", status: "online", voltage: 48.0, current: 12.3, temp: 24.5, power: 590, health: 78, uptime: 100, lastSeen: "Just now" },
  { id: "DEV-011", name: "Air Handler AH-1", type: "HVAC", location: "Floor 3", status: "offline", voltage: 0, current: 0, temp: 0, power: 0, health: 0, uptime: 76.4, lastSeen: "2h ago" },
  { id: "DEV-012", name: "UPS Alpha", type: "Power", location: "Server Room", status: "online", voltage: 230.0, current: 9.1, temp: 22.4, power: 2093, health: 100, uptime: 100, lastSeen: "Just now" },
];

const typeIcons: Record<string, React.ReactNode> = {
  HVAC: <Wind size={16} />,
  Cooling: <Wind size={16} />,
  Lighting: <Zap size={16} />,
  Renewable: <Sun size={16} />,
  Storage: <Battery size={16} />,
  Power: <Cpu size={16} />,
};

function HealthBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function DeviceCard({ device }: { device: typeof allDevices[0] }) {
  const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    online: { bg: "rgba(34,197,94,0.1)", text: "#22C55E", dot: "#22C55E" },
    warning: { bg: "rgba(245,158,11,0.1)", text: "#F59E0B", dot: "#F59E0B" },
    offline: { bg: "rgba(239,68,68,0.1)", text: "#EF4444", dot: "#EF4444" },
  };
  const sc = statusColors[device.status];
  const healthColor = device.health > 80 ? "#22C55E" : device.health > 50 ? "#F59E0B" : "#EF4444";

  return (
    <div
      className="p-5 rounded-2xl flex flex-col gap-4 transition-all cursor-pointer"
      style={{
        background: "rgba(30,41,59,0.7)",
        backdropFilter: "blur(12px)",
        border: device.status === "warning" ? "1px solid rgba(245,158,11,0.25)" : device.status === "offline" ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.3)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = device.status === "warning" ? "rgba(245,158,11,0.25)" : device.status === "offline" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)"}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: device.status === "offline" ? "rgba(100,116,139,0.2)" : "rgba(59,130,246,0.15)", color: device.status === "offline" ? "#475569" : "#3B82F6" }}>
            {typeIcons[device.type] || <Cpu size={16} />}
          </div>
          <div>
            <div style={{ color: "#F8FAFC", fontSize: 14, fontWeight: 600 }}>{device.name}</div>
            <div style={{ color: "#475569", fontSize: 12 }}>{device.id}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: sc.bg }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
          <span style={{ color: sc.text, fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{device.status}</span>
        </div>
      </div>

      {/* Location */}
      <div style={{ color: "#64748B", fontSize: 12 }}>{device.location}</div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Voltage", value: device.status === "offline" ? "—" : `${device.voltage}V`, color: "#3B82F6" },
          { label: "Current", value: device.status === "offline" ? "—" : `${Math.abs(device.current)}A`, color: "#8B5CF6" },
          { label: "Temp", value: device.status === "offline" ? "—" : `${device.temp}°C`, color: device.temp > 30 ? "#F59E0B" : "#22C55E" },
        ].map((m) => (
          <div key={m.label} className="p-2 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div style={{ color: m.color, fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Power */}
      <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="flex items-center gap-2">
          <Activity size={13} color="#3B82F6" />
          <span style={{ color: "#94A3B8", fontSize: 12 }}>Power</span>
        </div>
        <span style={{ color: device.power < 0 ? "#22C55E" : "#F8FAFC", fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
          {device.status === "offline" ? "— W" : `${device.power < 0 ? "-" : ""}${Math.abs(device.power).toLocaleString()} W`}
        </span>
      </div>

      {/* Health */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span style={{ color: "#64748B", fontSize: 11 }}>Device Health</span>
          <span style={{ color: healthColor, fontSize: 12, fontWeight: 600 }}>{device.status === "offline" ? "N/A" : `${device.health}%`}</span>
        </div>
        <HealthBar value={device.status === "offline" ? 0 : device.health} color={healthColor} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <span style={{ color: "#475569", fontSize: 11 }}>Uptime: {device.uptime}%</span>
        <span style={{ color: "#334155", fontSize: 11 }}>Last seen: {device.lastSeen}</span>
      </div>
    </div>
  );
}

export function Devices() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const types = ["All", ...Array.from(new Set(allDevices.map(d => d.type)))];

  const filtered = allDevices.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || d.type === filterType;
    const matchStatus = filterStatus === "All" || d.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const online = allDevices.filter(d => d.status === "online").length;
  const warning = allDevices.filter(d => d.status === "warning").length;
  const offline = allDevices.filter(d => d.status === "offline").length;

  return (
    <div className="p-6 flex flex-col gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Device Monitoring</h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>{allDevices.length} devices registered · {online} online</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6", fontSize: 13, fontWeight: 500 }}>
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Devices", value: allDevices.length, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
          { label: "Online", value: online, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
          { label: "Warnings", value: warning, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
          { label: "Offline", value: offline, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl flex items-center gap-4" style={{ background: s.bg, border: `1px solid ${s.color}25` }}>
            <div style={{ color: s.color, fontSize: 28, fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: "#94A3B8", fontSize: 13 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-xs" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)" }}>
          <Search size={14} color="#475569" />
          <input
            placeholder="Search devices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: "#F8FAFC", fontSize: 13 }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} color="#475569" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl outline-none"
            style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", color: "#94A3B8", fontSize: 13 }}
          >
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl outline-none"
            style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", color: "#94A3B8", fontSize: 13 }}
          >
            {["All", "online", "warning", "offline"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <span style={{ color: "#475569", fontSize: 13 }}>{filtered.length} results</span>
      </div>

      {/* Device grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filtered.map(device => <DeviceCard key={device.id} device={device} />)}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Cpu size={40} color="#1E293B" />
          <p style={{ color: "#475569", fontSize: 14, marginTop: 12 }}>No devices match your filters</p>
        </div>
      )}
    </div>
  );
}
