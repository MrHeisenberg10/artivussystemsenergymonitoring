import { useState, useEffect } from "react";
import {
  LayoutDashboard, Cpu, BarChart2, FileText, BellRing, Leaf,
  Settings, Zap, Search, Bell, ChevronDown, LogOut, User,
  Menu, X, Circle
} from "lucide-react";

type Page = "dashboard" | "devices" | "analytics" | "reports" | "alerts" | "sustainability" | "settings";

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "devices", label: "Devices", icon: <Cpu size={18} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
  { id: "reports", label: "Reports", icon: <FileText size={18} /> },
  { id: "alerts", label: "Alerts", icon: <BellRing size={18} />, badge: 3 },
  { id: "sustainability", label: "Sustainability", icon: <Leaf size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ color: "#94A3B8", fontSize: 13 }}>
      {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      {" · "}
      {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

export function Layout({ children, activePage, onNavigate, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#0F172A", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300"
        style={{
          width: sidebarOpen ? 240 : 72,
          background: "linear-gradient(180deg, #0F172A 0%, #0B1120 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>Artivus Systems</div>
              <div style={{ color: "#475569", fontSize: 11 }}>v4.2.1 Enterprise</div>
            </div>
          )}
        </div>

        {/* System status */}
        {sidebarOpen && (
          <div className="mx-3 my-3 px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <Circle size={8} fill="#22C55E" color="#22C55E" className="animate-pulse" />
            <span style={{ color: "#22C55E", fontSize: 12, fontWeight: 500 }}>All systems operational</span>
          </div>
        )}
        {!sidebarOpen && (
          <div className="flex justify-center my-3">
            <Circle size={8} fill="#22C55E" color="#22C55E" className="animate-pulse" />
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-2 py-2 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all relative w-full text-left"
                style={{
                  background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                  color: isActive ? "#3B82F6" : "#64748B",
                  borderLeft: isActive ? "2px solid #3B82F6" : "2px solid transparent",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#F8FAFC"; }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#64748B"; } }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full text-white" style={{ fontSize: 11, fontWeight: 600, background: "#EF4444", minWidth: 18, textAlign: "center" }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {!sidebarOpen && item.badge && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#EF4444", fontSize: 9, color: "#fff", fontWeight: 700 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
                <User size={16} color="#fff" />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 600 }}>John Mitchell</div>
                <div style={{ color: "#475569", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>admin@energysys.io</div>
              </div>
              <button onClick={onLogout} style={{ color: "#475569" }}>
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button onClick={onLogout} className="w-full flex justify-center p-2" style={{ color: "#475569" }}>
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header className="flex items-center gap-4 px-6 py-3 flex-shrink-0" style={{ background: "rgba(15,23,42,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex-shrink-0 p-2 rounded-lg transition-colors"
            style={{ color: "#64748B" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "#F8FAFC"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#64748B"; }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-xs px-3 py-2 rounded-xl" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Search size={15} color="#475569" />
            <input
              placeholder="Search devices, alerts..."
              className="flex-1 bg-transparent outline-none"
              style={{ color: "#F8FAFC", fontSize: 13 }}
            />
            <kbd style={{ color: "#475569", fontSize: 11, background: "rgba(255,255,255,0.05)", padding: "1px 5px", borderRadius: 4 }}>⌘K</kbd>
          </div>

          <div className="flex-1" />

          <Clock />

          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 rounded-xl transition-colors" style={{ color: "#64748B", background: "#1E293B" }}>
              <Bell size={18} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#EF4444", fontSize: 9, color: "#fff", fontWeight: 700 }}>
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Profile */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
              <User size={15} color="#fff" />
            </div>
            <span style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 500 }}>John M.</span>
            <ChevronDown size={14} color="#64748B" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ background: "#0F172A" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
