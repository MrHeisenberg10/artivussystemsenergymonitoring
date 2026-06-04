import { useState } from "react";
import { Search, Filter, RefreshCw, Wifi, WifiOff, AlertTriangle, Thermometer, Zap, Activity, Cpu, Wind, Sun, Battery } from "lucide-react";

export const allDevices = [
  // Utility Plant
  { id: "UTL-001", name: "Air Compressor 1", type: "Compressor", location: "Utility Plant", status: "online", voltage: 415, current: 85, temp: 38, power: 52000, health: 95, uptime: 99.5, lastSeen: "Just now" },

  { id: "UTL-002", name: "Air Compressor 2", type: "Compressor", location: "Utility Plant", status: "warning", voltage: 412, current: 92, temp: 48, power: 57000, health: 68, uptime: 95.2, lastSeen: "1m ago" },

  { id: "UTL-003", name: "Chiller 1", type: "Cooling", location: "Utility Plant", status: "online", voltage: 415, current: 120, temp: 12, power: 75000, health: 96, uptime: 99.8, lastSeen: "Just now" },

  { id: "UTL-004", name: "Cooling Tower", type: "Cooling", location: "Utility Plant", status: "online", voltage: 415, current: 35, temp: 28, power: 18000, health: 92, uptime: 99.3, lastSeen: "Just now" },

  { id: "UTL-005", name: "Water Transfer Pump", type: "Pump", location: "Utility Plant", status: "online", voltage: 415, current: 18, temp: 30, power: 9000, health: 97, uptime: 99.6, lastSeen: "Just now" },

  { id: "UTL-006", name: "Main Transformer", type: "Power", location: "Utility Plant", status: "online", voltage: 11000, current: 320, temp: 45, power: 250000, health: 98, uptime: 100, lastSeen: "Just now" },

  { id: "UTL-007", name: "DG Set", type: "Power", location: "Utility Plant", status: "offline", voltage: 0, current: 0, temp: 0, power: 0, health: 0, uptime: 88.4, lastSeen: "3h ago" },

  // Weaving Plant
  { id: "WEV-001", name: "Air Jet Loom Line 1", type: "Weaving", location: "Weaving Plant", status: "online", voltage: 415, current: 42, temp: 34, power: 22000, health: 94, uptime: 99.1, lastSeen: "Just now" },

  { id: "WEV-002", name: "Air Jet Loom Line 2", type: "Weaving", location: "Weaving Plant", status: "online", voltage: 415, current: 40, temp: 33, power: 21000, health: 93, uptime: 99.0, lastSeen: "Just now" },

  { id: "WEV-003", name: "Rapier Loom Line", type: "Weaving", location: "Weaving Plant", status: "warning", voltage: 410, current: 48, temp: 41, power: 24500, health: 65, uptime: 94.7, lastSeen: "5m ago" },

  { id: "WEV-004", name: "Warping Machine", type: "Preparation", location: "Weaving Plant", status: "online", voltage: 415, current: 25, temp: 29, power: 12000, health: 96, uptime: 99.4, lastSeen: "Just now" },

  { id: "WEV-005", name: "Sizing Machine", type: "Preparation", location: "Weaving Plant", status: "online", voltage: 415, current: 28, temp: 31, power: 14500, health: 92, uptime: 98.7, lastSeen: "Just now" },

  { id: "WEV-006", name: "Humidification Plant", type: "HVAC", location: "Weaving Plant", status: "online", voltage: 415, current: 55, temp: 26, power: 30000, health: 95, uptime: 99.5, lastSeen: "Just now" },

  { id: "WEV-007", name: "Fabric Inspection Machine", type: "Inspection", location: "Weaving Plant", status: "online", voltage: 230, current: 8, temp: 27, power: 1800, health: 99, uptime: 99.9, lastSeen: "Just now" },

  { id: "WEV-008", name: "Packaging Unit", type: "Packaging", location: "Weaving Plant", status: "online", voltage: 230, current: 12, temp: 29, power: 2800, health: 97, uptime: 99.7, lastSeen: "Just now" }
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
