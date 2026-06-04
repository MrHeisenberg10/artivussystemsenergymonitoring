import { FileText, Download, Calendar, BarChart2, FileBarChart, FileSpreadsheet, ChevronRight } from "lucide-react";

const reports = [
  { id: "RPT-001", name: "Monthly Energy Summary — May 2026", type: "Energy", format: "PDF", size: "2.4 MB", generated: "Jun 1, 2026", status: "ready" },
  { id: "RPT-002", name: "Device Health Report — Q2 2026", type: "Devices", format: "XLSX", size: "1.8 MB", generated: "May 31, 2026", status: "ready" },
  { id: "RPT-003", name: "Carbon Footprint Analysis — 2026", type: "Sustainability", format: "PDF", size: "4.1 MB", generated: "May 28, 2026", status: "ready" },
  { id: "RPT-004", name: "Peak Load Analysis — May 2026", type: "Analytics", format: "CSV", size: "842 KB", generated: "May 26, 2026", status: "ready" },
  { id: "RPT-005", name: "Fault & Maintenance Log — Q2", type: "Maintenance", format: "PDF", size: "1.2 MB", generated: "May 20, 2026", status: "ready" },
  { id: "RPT-006", name: "Energy Cost Breakdown — 2026", type: "Finance", format: "XLSX", size: "3.2 MB", generated: "May 15, 2026", status: "ready" },
  { id: "RPT-007", name: "June 2026 Energy Report", type: "Energy", format: "PDF", size: "—", generated: "Generating…", status: "pending" },
];

const typeColors: Record<string, string> = {
  Energy: "#3B82F6",
  Devices: "#8B5CF6",
  Sustainability: "#22C55E",
  Analytics: "#F59E0B",
  Maintenance: "#EF4444",
  Finance: "#22C55E",
};

const formatIcons: Record<string, React.ReactNode> = {
  PDF: <FileText size={14} />,
  XLSX: <FileSpreadsheet size={14} />,
  CSV: <FileBarChart size={14} />,
};

function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ background: "rgba(30,41,59,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

export function Reports() {
  return (
    <div className="p-6 flex flex-col gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Reports</h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>Generated reports and data exports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6", fontSize: 13, fontWeight: 500, border: "1px solid rgba(59,130,246,0.25)" }}>
          <BarChart2 size={14} />
          Generate New Report
        </button>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { label: "Energy", icon: <FileText size={20} />, desc: "Monthly & annual energy consumption reports", color: "#3B82F6" },
          { label: "Analytics", icon: <BarChart2 size={20} />, desc: "Peak load, demand response, trend analysis", color: "#F59E0B" },
          { label: "Sustainability", icon: <FileBarChart size={20} />, desc: "CO₂, carbon footprint, green energy metrics", color: "#22C55E" },
        ].map(r => (
          <div
            key={r.label}
            className="p-5 cursor-pointer transition-all rounded-2xl"
            style={{ background: "rgba(30,41,59,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${r.color}40`}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${r.color}20`, color: r.color }}>
                {r.icon}
              </div>
              <span style={{ color: "#F8FAFC", fontSize: 14, fontWeight: 600 }}>{r.label} Reports</span>
            </div>
            <p style={{ color: "#64748B", fontSize: 12 }}>{r.desc}</p>
            <div className="flex items-center gap-1 mt-3" style={{ color: r.color, fontSize: 12, fontWeight: 500 }}>
              Generate <ChevronRight size={13} />
            </div>
          </div>
        ))}
      </div>

      {/* Report history table */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Report History</h3>
          <div className="flex items-center gap-2">
            <Calendar size={14} color="#475569" />
            <select className="px-3 py-1.5 rounded-lg outline-none" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8", fontSize: 13 }}>
              <option>All time</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Report Name", "Type", "Format", "Size", "Generated", "Status", ""].map(h => (
                  <th key={h} className="text-left pb-3" style={{ color: "#475569", fontSize: 11, fontWeight: 600, paddingRight: 16, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="py-3 pr-4">
                    <div style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                    <div style={{ color: "#475569", fontSize: 11 }}>{r.id}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded-full" style={{ background: `${typeColors[r.type]}15`, color: typeColors[r.type], fontSize: 11, fontWeight: 600 }}>{r.type}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5" style={{ color: "#94A3B8", fontSize: 12 }}>
                      {formatIcons[r.format]}
                      {r.format}
                    </div>
                  </td>
                  <td className="py-3 pr-4" style={{ color: "#94A3B8", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>{r.size}</td>
                  <td className="py-3 pr-4" style={{ color: "#94A3B8", fontSize: 12 }}>{r.generated}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded-full" style={{
                      background: r.status === "ready" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                      color: r.status === "ready" ? "#22C55E" : "#F59E0B",
                      fontSize: 11, fontWeight: 600
                    }}>{r.status}</span>
                  </td>
                  <td className="py-3">
                    {r.status === "ready" && (
                      <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all" style={{ background: "rgba(59,130,246,0.12)", color: "#3B82F6", fontSize: 12 }}>
                        <Download size={12} />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
