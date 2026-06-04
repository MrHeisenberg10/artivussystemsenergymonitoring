import { useState } from "react";
import { Zap, Eye, EyeOff, Shield, Wifi, Activity } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("admin@energysys.io");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: "#0F172A", fontFamily: "'Inter', sans-serif" }}>
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)" }}>
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        {/* Floating orbs */}
        <div className="absolute top-32 left-24 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }} />
        <div className="absolute bottom-32 right-12 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #22C55E, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-10 blur-2xl" style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Artivus Systems</span>
        </div>

        {/* Center illustration */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1">
          {/* Circular energy monitor */}
          <div className="relative mb-8">
            <svg width="280" height="280" viewBox="0 0 280 280">
              {/* Outer ring */}
              <circle cx="140" cy="140" r="130" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
              <circle cx="140" cy="140" r="130" fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="2" strokeDasharray="200 620" strokeLinecap="round" transform="rotate(-90 140 140)" />
              {/* Middle ring */}
              <circle cx="140" cy="140" r="105" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="1" />
              <circle cx="140" cy="140" r="105" fill="none" stroke="rgba(34,197,94,0.7)" strokeWidth="2" strokeDasharray="350 460" strokeLinecap="round" transform="rotate(-90 140 140)" />
              {/* Inner ring */}
              <circle cx="140" cy="140" r="80" fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="1" />
              <circle cx="140" cy="140" r="80" fill="none" stroke="rgba(245,158,11,0.6)" strokeWidth="2" strokeDasharray="180 322" strokeLinecap="round" transform="rotate(-90 140 140)" />
              {/* Center glow */}
              <circle cx="140" cy="140" r="55" fill="rgba(30,41,59,0.9)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
              {/* Center icon */}
              <text x="140" y="135" textAnchor="middle" fill="#3B82F6" fontSize="28" fontWeight="bold">⚡</text>
              <text x="140" y="158" textAnchor="middle" fill="#94A3B8" fontSize="10">GRID STATUS</text>
              <text x="140" y="174" textAnchor="middle" fill="#22C55E" fontSize="14" fontWeight="bold">OPTIMAL</text>
              {/* Data points */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const r = 130;
                const x = 140 + r * Math.cos((angle - 90) * Math.PI / 180);
                const y = 140 + r * Math.sin((angle - 90) * Math.PI / 180);
                return <circle key={i} cx={x} cy={y} r="4" fill={i % 2 === 0 ? "#3B82F6" : "#22C55E"} />;
              })}
            </svg>
          </div>

          {/* Stats row */}
          <div className="flex gap-8">
            {[
              { label: "Active Devices", value: "2,847", color: "#3B82F6" },
              { label: "Energy Saved", value: "34.2%", color: "#22C55E" },
              { label: "Buildings", value: "156", color: "#F59E0B" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div style={{ color: stat.color, fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
                <div style={{ color: "#94A3B8", fontSize: 12 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom features */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { icon: <Activity size={16} color="#3B82F6" />, title: "Real-time", desc: "Live monitoring" },
            { icon: <Wifi size={16} color="#22C55E" />, title: "IoT Ready", desc: "10K+ sensors" },
            { icon: <Shield size={16} color="#F59E0B" />, title: "Secure", desc: "Enterprise grade" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="mt-0.5">{f.icon}</div>
              <div>
                <div style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 600 }}>{f.title}</div>
                <div style={{ color: "#64748B", fontSize: 11 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 items-center justify-center p-8" style={{ background: "#0F172A" }}>
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 700 }}>Artivus Systems</span>
          </div>

          <div className="mb-8">
            <h1 style={{ color: "#F8FAFC", fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>Welcome back</h1>
            <p style={{ color: "#94A3B8", fontSize: 14 }}>Sign in to your energy management dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 500 }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: "#1E293B",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#F8FAFC",
                  fontSize: 14,
                }}
                onFocus={e => e.target.style.borderColor = "#3B82F6"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                placeholder="admin@energysys.io"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label style={{ color: "#94A3B8", fontSize: 13, fontWeight: 500 }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all"
                  style={{
                    background: "#1E293B",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#F8FAFC",
                    fontSize: 14,
                  }}
                  onFocus={e => e.target.style.borderColor = "#3B82F6"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: "#64748B" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setRemember(!remember)}
                  className="w-4 h-4 rounded flex items-center justify-center cursor-pointer transition-all"
                  style={{
                    background: remember ? "#3B82F6" : "transparent",
                    border: `1.5px solid ${remember ? "#3B82F6" : "rgba(255,255,255,0.2)"}`,
                  }}
                >
                  {remember && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>}
                </div>
                <span style={{ color: "#94A3B8", fontSize: 13 }}>Remember me</span>
              </label>
              <button type="button" style={{ color: "#3B82F6", fontSize: 13, fontWeight: 500 }}>Forgot password?</button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl transition-all"
              style={{
                background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #3B82F6, #2563EB)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 24px rgba(59,130,246,0.3)",
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : "Sign in to dashboard"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span style={{ color: "#475569", fontSize: 12 }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* SSO */}
          <button
            className="w-full py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            style={{
              background: "#1E293B",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#F8FAFC",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Shield size={16} color="#94A3B8" />
            Single Sign-On (SSO)
          </button>

          <p className="mt-6 text-center" style={{ color: "#475569", fontSize: 12 }}>
            Protected by enterprise-grade encryption · SOC 2 Type II certified
          </p>
        </div>
      </div>
    </div>
  );
}
