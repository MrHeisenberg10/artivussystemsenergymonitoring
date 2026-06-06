/**
 * Updated Sustainability Component with Real Backend Data
 * 
 * This file shows the RECOMMENDED way to update the Sustainability component
 * to fetch real energy consumption data from your backend API.
 * 
 * Copy this pattern and replace your current Sustainability.tsx implementation
 */

import { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Leaf, Sun, Wind, TrendingDown, Award, Globe, Zap, Droplets, TreePine } from "lucide-react";
import {
  calculateTotalCarbonFootprint,
  getTreeEquivalent,
  getEmissionBreakdown,
  EMISSION_FACTORS,
} from "../../utils/carbonFootprint";

// ============================================================================
// Hook for fetching real energy data
// ============================================================================

const useFetchEnergyData = (refreshInterval: number = 5 * 60 * 1000) => {
  const [energyConsumption, setEnergyConsumption] = useState({
    electricity: 0,
    diesel: 0,
    petrol: 0,
    lpg: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // OPTION 1: Fetch from REST API endpoint
        const response = await fetch(
          `/api/carbon-footprint/monthly/${year}/${month}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error('Invalid API response format');
        }

        setEnergyConsumption({
          electricity: data.data.breakdown.electricity.consumption,
          diesel: data.data.breakdown.diesel.consumption,
          petrol: data.data.breakdown.petrol.consumption,
          lpg: data.data.breakdown.lpg.consumption,
        });

        setLastUpdated(new Date());
      } catch (err: any) {
        console.error('Error fetching energy data:', err);
        setError(err.message);
        
        // Fallback to mock data for development
        console.warn('Using mock data due to API error');
        setEnergyConsumption({
          electricity: 100000,
          diesel: 5000,
          petrol: 1000,
          lpg: 500,
        });
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up periodic refresh
    const interval = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { energyConsumption, loading, error, lastUpdated };
};

// ============================================================================
// Updated Sustainability Component
// ============================================================================

export function Sustainability() {
  const sustainScore = 82;
  
  // Fetch energy data from backend
  const { energyConsumption, loading, error, lastUpdated } = useFetchEnergyData();

  // Calculate carbon emissions based on fetched data
  const carbonEmissions = useMemo(() => {
    return calculateTotalCarbonFootprint(energyConsumption);
  }, [energyConsumption]);

  const treeEquivalent = useMemo(() => {
    return getTreeEquivalent(carbonEmissions.total.emissionsTonnes);
  }, [carbonEmissions]);

  const emissionBreakdown = useMemo(() => {
    return getEmissionBreakdown(carbonEmissions);
  }, [carbonEmissions]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div style={{ textAlign: 'center', color: '#94A3B8' }}>
          <div style={{ fontSize: 18, marginBottom: 16 }}>Loading energy data...</div>
          <div style={{ fontSize: 12 }}>Fetching carbon calculations from backend</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div style={{ 
          textAlign: 'center', 
          color: '#EF4444',
          padding: 24,
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 12,
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{ fontSize: 18, marginBottom: 8 }}>Error Loading Data</div>
          <div style={{ fontSize: 12, marginBottom: 16 }}>{error}</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>Using fallback data. Check backend connection.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header with last update timestamp */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Sustainability
          </h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 2 }}>
            Environmental impact & carbon emissions · Raymond Textile Plant
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span style={{ color: "#64748B", fontSize: 11 }}>
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <Leaf size={14} color="#22C55E" />
            <span style={{ color: "#22C55E", fontSize: 13, fontWeight: 600 }}>Green Building Certified</span>
          </div>
        </div>
      </div>

      {/* Top KPIs - Updated with Real Data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "CO₂ This Month", 
            value: `${carbonEmissions.total.emissionsTonnes.toFixed(1)} t`, 
            delta: "-43%", 
            icon: <Globe size={18} />, 
            color: "#22C55E", 
            sub: "tCO₂e" 
          },
          { 
            label: "Electricity Impact", 
            value: `${carbonEmissions.electricity.emissionsTonnes.toFixed(1)} t`, 
            delta: `${emissionBreakdown.electricity}%`, 
            icon: <Zap size={18} />, 
            color: "#3B82F6", 
            sub: "of total" 
          },
          { 
            label: "Fuel Impact", 
            value: `${(carbonEmissions.diesel.emissionsTonnes + carbonEmissions.petrol.emissionsTonnes).toFixed(1)} t`, 
            delta: `${(Number(emissionBreakdown.diesel) + Number(emissionBreakdown.petrol)).toFixed(1)}%`, 
            icon: <Wind size={18} />, 
            color: "#F59E0B", 
            sub: "diesel + petrol" 
          },
          { 
            label: "Trees Equivalent", 
            value: `${treeEquivalent}`, 
            delta: "carbon offset", 
            icon: <TreePine size={18} />, 
            color: "#22C55E", 
            sub: "trees to plant" 
          },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 rounded-xl" style={{ background: "rgba(30,41,59,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}20`, color: kpi.color }}>
                {kpi.icon}
              </div>
              <span style={{ color: kpi.color, fontSize: 12, fontWeight: 600 }}>{kpi.delta}</span>
            </div>
            <div style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700 }}>{kpi.value}</div>
            <div style={{ color: "#F8FAFC", fontSize: 12, marginTop: 2 }}>{kpi.label}</div>
            <div style={{ color: "#334155", fontSize: 11, marginTop: 1 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Detailed Carbon Footprint Calculation Card */}
      <div className="p-6 rounded-2xl" style={{ background: "rgba(30,41,59,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600 }}>
              Carbon Footprint Calculation - Indian Standards
            </h3>
            <p style={{ color: "#64748B", fontSize: 12, marginTop: 1 }}>
              Energy consumption × Emission factors (kg CO₂e/unit)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Electricity */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(59,130,246,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} color="#3B82F6" />
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>Electricity</span>
            </div>
            <div style={{ color: "#3B82F6", fontSize: 18, fontWeight: 700 }}>
              {carbonEmissions.electricity.emissionsTonnes.toFixed(1)}
            </div>
            <div style={{ color: "#64748B", fontSize: 10, marginTop: 1 }}>tCO₂e</div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 3 }}>
              {energyConsumption.electricity} kWh × {EMISSION_FACTORS.ELECTRICITY} = {carbonEmissions.electricity.emissions.toFixed(0)} kg
            </div>
          </div>

          {/* Diesel */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Droplets size={16} color="#EF4444" />
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>Diesel</span>
            </div>
            <div style={{ color: "#EF4444", fontSize: 18, fontWeight: 700 }}>
              {carbonEmissions.diesel.emissionsTonnes.toFixed(1)}
            </div>
            <div style={{ color: "#64748B", fontSize: 10, marginTop: 1 }}>tCO₂e</div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 3 }}>
              {energyConsumption.diesel} L × {EMISSION_FACTORS.DIESEL} = {carbonEmissions.diesel.emissions.toFixed(0)} kg
            </div>
          </div>

          {/* Petrol */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Wind size={16} color="#F59E0B" />
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>Petrol</span>
            </div>
            <div style={{ color: "#F59E0B", fontSize: 18, fontWeight: 700 }}>
              {carbonEmissions.petrol.emissionsTonnes.toFixed(1)}
            </div>
            <div style={{ color: "#64748B", fontSize: 10, marginTop: 1 }}>tCO₂e</div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 3 }}>
              {energyConsumption.petrol} L × {EMISSION_FACTORS.PETROL} = {carbonEmissions.petrol.emissions.toFixed(0)} kg
            </div>
          </div>

          {/* LPG */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Sun size={16} color="#8B5CF6" />
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>LPG</span>
            </div>
            <div style={{ color: "#8B5CF6", fontSize: 18, fontWeight: 700 }}>
              {carbonEmissions.lpg.emissionsTonnes.toFixed(1)}
            </div>
            <div style={{ color: "#64748B", fontSize: 10, marginTop: 1 }}>tCO₂e</div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 3 }}>
              {energyConsumption.lpg} kg × {EMISSION_FACTORS.LPG} = {carbonEmissions.lpg.emissions.toFixed(0)} kg
            </div>
          </div>

          {/* Total */}
          <div className="p-4 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(30,41,59,0.7) 100%)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} color="#22C55E" />
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>Total</span>
            </div>
            <div style={{ color: "#22C55E", fontSize: 18, fontWeight: 700 }}>
              {carbonEmissions.total.emissionsTonnes.toFixed(1)}
            </div>
            <div style={{ color: "#64748B", fontSize: 10, marginTop: 1 }}>tCO₂e</div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 3 }}>
              Monthly carbon footprint
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your original component (charts, etc.) goes here... */}
      <div style={{ 
        padding: 16, 
        borderRadius: 12, 
        background: "rgba(34,197,94,0.1)", 
        border: "1px solid rgba(34,197,94,0.2)",
        color: "#22C55E"
      }}>
        ✅ Real data integration active - Update interval: 5 minutes
      </div>
    </div>
  );
}

// ============================================================================
// Export
// ============================================================================

export default Sustainability;
