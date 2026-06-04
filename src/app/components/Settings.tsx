import { useState } from "react";
import { User, Bell, Shield, Wifi, Palette, Save, ToggleLeft, ToggleRight } from "lucide-react";

function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ background: "rgba(30,41,59,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, ...style }}>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="relative w-10 h-5 rounded-full transition-all" style={{ background: value ? "#3B82F6" : "#334155" }}>
      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: value ? "calc(100% - 18px)" : "2px" }} />
    </button>
  );
}

export function Settings() {
  const [notif, setNotif] = useState({ email: true, sms: false, push: true, digest: true });
  const [thresholds, setThresholds] = useState({ loadWarning: 85, loadCritical: 95, tempWarning: 40, tempCritical: 50 });

  return (
    <div className="p-6 flex flex-col gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div>
        <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Settings</h1>
        <p style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>Manage system preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <User size={16} color="#3B82F6" />
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Profile</h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { label: "Full Name", value: "Sharad Sharma" },
              { label: "Email", value: "sharadsharma@artivussystems.com" },
              { label: "Role", value: "System Administrator" },
              { label: "Organization", value: "Raymond Textile Plant" },
            ].map(f => (
              <div key={f.label}>
                <label style={{ color: "#64748B", fontSize: 12, fontWeight: 500 }}>{f.label}</label>
                <input
                  defaultValue={f.value}
                  className="w-full mt-1 px-3 py-2 rounded-xl outline-none"
                  style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)", color: "#F8FAFC", fontSize: 13 }}
                />
              </div>
            ))}
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl mt-2 self-start" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6", fontSize: 13, fontWeight: 500 }}>
              <Save size={13} /> Save Profile
            </button>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} color="#3B82F6" />
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Notifications</h3>
          </div>
          <div className="flex flex-col gap-4">
            {(Object.entries(notif) as [keyof typeof notif, boolean][]).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div>
                  <div style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 500, textTransform: "capitalize" }}>{key === "digest" ? "Daily Digest" : key === "push" ? "Push Notifications" : key === "sms" ? "SMS Alerts" : "Email Alerts"}</div>
                  <div style={{ color: "#475569", fontSize: 11, marginTop: 1 }}>
                    {key === "email" ? "Critical and warning alerts" : key === "sms" ? "Critical alerts only" : key === "push" ? "All alerts in real-time" : "Morning summary email"}
                  </div>
                </div>
                <Toggle value={val} onChange={v => setNotif(prev => ({ ...prev, [key]: v }))} />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Alert Thresholds */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} color="#F59E0B" />
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>Alert Thresholds</h3>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { label: "Load Warning", key: "loadWarning", unit: "%", color: "#F59E0B" },
              { label: "Load Critical", key: "loadCritical", unit: "%", color: "#EF4444" },
              { label: "Temp Warning", key: "tempWarning", unit: "°C", color: "#F59E0B" },
              { label: "Temp Critical", key: "tempCritical", unit: "°C", color: "#EF4444" },
            ].map(t => (
              <div key={t.key}>
                <div className="flex items-center justify-between mb-2">
                  <label style={{ color: "#94A3B8", fontSize: 12, fontWeight: 500 }}>{t.label}</label>
                  <span style={{ color: t.color, fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                    {thresholds[t.key as keyof typeof thresholds]}{t.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={thresholds[t.key as keyof typeof thresholds]}
                  onChange={e => setThresholds(prev => ({ ...prev, [t.key]: Number(e.target.value) }))}
                  className="w-full"
                  style={{ accentColor: t.color }}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* System */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-5">
            <Wifi size={16} color="#22C55E" />
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>System Configuration</h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { label: "Polling Interval", value: "5s", options: ["1s", "5s", "10s", "30s", "60s"] },
              { label: "Data Retention", value: "24 months", options: ["3 months", "6 months", "12 months", "24 months", "Forever"] },
              { label: "Timezone", value: "UTC+0 (GMT)", options: ["UTC-8 (PST)", "UTC-5 (EST)", "UTC+0 (GMT)", "UTC+1 (CET)"] },
            ].map(f => (
              <div key={f.label}>
                <label style={{ color: "#64748B", fontSize: 12, fontWeight: 500 }}>{f.label}</label>
                <select defaultValue={f.value} className="w-full mt-1 px-3 py-2 rounded-xl outline-none" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)", color: "#F8FAFC", fontSize: 13 }}>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 500 }}>System Version</div>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>Artivus Systems v4.2.1 · Build 20260602</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
