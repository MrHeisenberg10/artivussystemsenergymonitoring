import { useState } from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle, X, Bell, BellOff, Filter, Search, ChevronRight, Clock, Cpu, Zap, Wind, Thermometer } from "lucide-react";

type Severity = "critical" | "warning" | "info" | "resolved";

interface Alert {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  device: string;
  location: string;
  time: string;
  elapsed: string;
  acknowledged: boolean;
  code: string;
}

const alerts: Alert[] = [
  { id: "ALT-001", severity: "critical", title: "HVAC Unit 3 — Thermal Overload", description: "Unit temperature exceeded 45°C safety threshold. Automatic shutdown triggered. Immediate inspection required.", device: "HVAC Unit 3", location: "Floor 4 · Zone B", time: "Jun 3, 2026 · 09:14", elapsed: "2m ago", acknowledged: false, code: "ERR_THERM_OVR" },
  { id: "ALT-002", severity: "critical", title: "Ground Fault Detected — Circuit 12", description: "Insulation resistance below minimum threshold. Potential shock hazard. Circuit isolated.", device: "Circuit Breaker CB-12", location: "Main Panel · Basement", time: "Jun 3, 2026 · 09:08", elapsed: "8m ago", acknowledged: false, code: "ERR_GND_FAULT" },
  { id: "ALT-003", severity: "warning", title: "Load Threshold Exceeded 95%", description: "Current demand approaching peak capacity limit of 5 MW. Demand response protocol may activate.", device: "Main Grid Feed", location: "Utility Connection", time: "Jun 3, 2026 · 08:55", elapsed: "21m ago", acknowledged: true, code: "WARN_LOAD_PEAK" },
  { id: "ALT-004", severity: "warning", title: "Sensor Communication Failure", description: "Environmental sensor cluster in Zone D has lost connectivity. Readings may be inaccurate.", device: "Sensor Array D-01", location: "Parking Level 2", time: "Jun 3, 2026 · 08:40", elapsed: "36m ago", acknowledged: false, code: "WARN_COMM_FAIL" },
  { id: "ALT-005", severity: "warning", title: "Battery SoC Below 20%", description: "Battery storage system at 18% state of charge. Consider reducing discharge or switching to grid.", device: "Battery Bank 2", location: "Energy Storage Room", time: "Jun 3, 2026 · 08:22", elapsed: "54m ago", acknowledged: true, code: "WARN_BATT_LOW" },
  { id: "ALT-006", severity: "info", title: "Scheduled Maintenance Due", description: "Chiller Unit #1 is due for quarterly servicing. Schedule downtime window within 7 days.", device: "Chiller #1", location: "Rooftop", time: "Jun 3, 2026 · 08:00", elapsed: "1h 16m ago", acknowledged: true, code: "INFO_MAINT_DUE" },
  { id: "ALT-007", severity: "info", title: "Firmware Update Available", description: "Artivus Systems firmware v4.3.0 available for 14 compatible devices. Review changelog before deploying.", device: "System Controller", location: "Server Room", time: "Jun 3, 2026 · 07:30", elapsed: "1h 46m ago", acknowledged: true, code: "INFO_FW_UPDATE" },
  { id: "ALT-008", severity: "resolved", title: "UPS Battery Failure — Resolved", description: "UPS battery cell failure in Unit Alpha was replaced. System now operating at full capacity.", device: "UPS Alpha", location: "Server Room", time: "Jun 3, 2026 · 06:15", elapsed: "3h 1m ago", acknowledged: true, code: "RES_UPS_FAIL" },
  { id: "ALT-009", severity: "resolved", title: "Power Outage — Zone C Recovered", description: "Zone C power was restored after 4m 23s outage. Root cause: Utility grid fault upstream.", device: "Zone C Feeder", location: "Floors 5–8", time: "Jun 2, 2026 · 23:48", elapsed: "9h 28m ago", acknowledged: true, code: "RES_PWR_OUT" },
];

const timeline = [
  { time: "09:14", event: "HVAC Unit 3 shutdown triggered by thermal overload", severity: "critical" },
  { time: "09:10", event: "Thermal sensor alert: 41°C detected on HVAC Unit 3", severity: "warning" },
  { time: "09:08", event: "Ground fault detected on Circuit 12 — isolation relay opened", severity: "critical" },
  { time: "08:55", event: "Load demand reached 95% of capacity limit", severity: "warning" },
  { time: "08:40", event: "Sensor cluster D-01 communication timeout after 3 retries", severity: "warning" },
  { time: "08:22", event: "Battery Bank 2 SoC fell below 20% threshold", severity: "warning" },
  { time: "08:00", event: "Maintenance reminder triggered for Chiller #1", severity: "info" },
  { time: "07:30", event: "Firmware v4.3.0 available — 14 devices eligible", severity: "info" },
  { time: "06:15", event: "UPS Alpha battery replaced — system restored", severity: "resolved" },
];

const errorLogs = [
  { timestamp: "2026-06-03T09:14:22Z", level: "CRITICAL", source: "HVAC_CTRL_03", message: "ThermalOverloadException: Temp=45.8°C > Threshold=45.0°C" },
  { timestamp: "2026-06-03T09:08:11Z", level: "CRITICAL", source: "ELEC_CB_12", message: "GroundFaultDetected: InsulationRes=0.3MΩ < Min=1.0MΩ" },
  { timestamp: "2026-06-03T08:55:04Z", level: "WARNING", source: "GRID_MONITOR", message: "LoadThreshold: Current=4.75MW, Limit=5.0MW, Margin=5.0%" },
  { timestamp: "2026-06-03T08:40:38Z", level: "WARNING", source: "SENSOR_D01", message: "CommTimeout: Attempts=3/3, LastResponse=08:37:22Z" },
  { timestamp: "2026-06-03T08:22:15Z", level: "WARNING", source: "BATT_BANK_02", message: "SoCLow: Current=18.4%, Threshold=20.0%" },
  { timestamp: "2026-06-03T06:15:44Z", level: "INFO", source: "UPS_ALPHA", message: "BatteryReplaced: OldCell=3/8 failed, Status=Nominal" },
];

const severityConfig: Record<Severity, { icon: React.ReactNode; color: string; bg: string; border: string; label: string }> = {
  critical: { icon: <AlertTriangle size={15} />, color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", label: "Critical" },
  warning: { icon: <AlertCircle size={15} />, color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "Warning" },
  info: { icon: <Info size={15} />, color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", label: "Info" },
  resolved: { icon: <CheckCircle size={15} />, color: "#22C55E", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.15)", label: "Resolved" },
};

function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ background: "rgba(30,41,59,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

export function Alerts() {
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [search, setSearch] = useState("");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const filtered = alerts.filter(a => {
    if (dismissed.has(a.id)) return false;
    if (filter !== "all" && a.severity !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.device.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    critical: alerts.filter(a => a.severity === "critical" && !dismissed.has(a.id)).length,
    warning: alerts.filter(a => a.severity === "warning" && !dismissed.has(a.id)).length,
    info: alerts.filter(a => a.severity === "info" && !dismissed.has(a.id)).length,
    resolved: alerts.filter(a => a.severity === "resolved" && !dismissed.has(a.id)).length,
  };

  return (
    <div className="p-6 flex flex-col gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Alerts & Notifications</h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>Real-time event monitoring · {counts.critical + counts.warning} active issues</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "#1E293B", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)", fontSize: 13 }}>
          <Bell size={14} />
          Configure
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(["critical", "warning", "info", "resolved"] as Severity[]).map(s => {
          const sc = severityConfig[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(filter === s ? "all" : s)}
              className="p-4 rounded-2xl text-left transition-all"
              style={{
                background: filter === s ? sc.bg : "rgba(30,41,59,0.5)",
                border: `1px solid ${filter === s ? sc.border : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div style={{ color: sc.color }}>{sc.icon}</div>
                <span style={{ color: "#475569", fontSize: 11 }}>View</span>
              </div>
              <div style={{ color: sc.color, fontSize: 28, fontWeight: 700 }}>{counts[s]}</div>
              <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>{sc.label}</div>
            </button>
          );
        })}
      </div>

      {/* Alert list + timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Alert list */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Search size={14} color="#475569" />
              <input
                placeholder="Search alerts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                style={{ color: "#F8FAFC", fontSize: 13 }}
              />
            </div>
            <span style={{ color: "#475569", fontSize: 12 }}>{filtered.length} alerts</span>
          </div>

          {/* Alert cards */}
          {filtered.map(alert => {
            const sc = severityConfig[alert.severity];
            return (
              <div
                key={alert.id}
                className="p-4 rounded-2xl flex gap-4"
                style={{
                  background: alert.acknowledged ? "rgba(30,41,59,0.4)" : sc.bg,
                  border: `1px solid ${alert.acknowledged ? "rgba(255,255,255,0.06)" : sc.border}`,
                  opacity: alert.acknowledged ? 0.7 : 1,
                }}
              >
                <div className="flex-shrink-0 mt-0.5" style={{ color: sc.color }}>
                  {sc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 600 }}>{alert.title}</span>
                      {!alert.acknowledged && (
                        <span className="px-1.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 700, border: `1px solid ${sc.border}` }}>NEW</span>
                      )}
                    </div>
                    <button onClick={() => setDismissed(prev => new Set([...prev, alert.id]))} style={{ color: "#334155", flexShrink: 0 }}>
                      <X size={14} />
                    </button>
                  </div>
                  <p style={{ color: "#64748B", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{alert.description}</p>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span style={{ color: "#475569", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{alert.code}</span>
                    <span style={{ color: "#334155", fontSize: 11 }}>•</span>
                    <span style={{ color: "#475569", fontSize: 11 }}>{alert.device}</span>
                    <span style={{ color: "#334155", fontSize: 11 }}>•</span>
                    <span style={{ color: "#475569", fontSize: 11 }}>{alert.location}</span>
                    <span className="ml-auto" style={{ color: "#334155", fontSize: 11 }}>{alert.elapsed}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: timeline + error log */}
        <div className="flex flex-col gap-4">
          {/* System event timeline */}
          <GlassCard className="p-5">
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Event Timeline</h3>
            <div className="relative flex flex-col gap-0">
              {timeline.map((e, i) => {
                const sc = severityConfig[e.severity as Severity];
                return (
                  <div key={i} className="flex gap-3 pb-4 relative">
                    {/* Line */}
                    {i < timeline.length - 1 && (
                      <div className="absolute left-[10px] top-5 bottom-0 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    )}
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: sc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ color: "#F8FAFC", fontSize: 12 }}>{e.event}</div>
                      <div style={{ color: "#475569", fontSize: 11, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{e.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Error logs */}
          <GlassCard className="p-5">
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Error Logs</h3>
            <div className="flex flex-col gap-2">
              {errorLogs.map((log, i) => (
                <div key={i} className="p-2 rounded-lg" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{
                      color: log.level === "CRITICAL" ? "#EF4444" : log.level === "WARNING" ? "#F59E0B" : "#3B82F6",
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>[{log.level}]</span>
                    <span style={{ color: "#64748B", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>{log.source}</span>
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", overflowWrap: "break-word" }}>{log.message}</div>
                  <div style={{ color: "#334155", fontSize: 10, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{log.timestamp}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
