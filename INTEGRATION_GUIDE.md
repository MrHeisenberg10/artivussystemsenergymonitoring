/**
 * Carbon Footprint Integration Guide - Real Data Examples
 * 
 * This file shows practical examples of how to integrate the carbon footprint
 * calculations with real energy consumption data from various sources.
 */

// ============================================================================
// Example 1: API-based Data Fetching
// ============================================================================

/**
 * Fetch energy consumption from backend API
 * Update in: src/app/components/Sustainability.tsx
 */
export const useCarbonFootprintFromAPI = () => {
  const [energyConsumption, setEnergyConsumption] = React.useState({
    electricity: 0,
    diesel: 0,
    petrol: 0,
    lpg: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        setLoading(true);
        
        // Fetch current month's data
        const response = await fetch(
          `/api/carbon-footprint/monthly/${new Date().getFullYear()}/${new Date().getMonth() + 1}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch energy data');
        
        const data = await response.json();
        
        setEnergyConsumption({
          electricity: data.data.breakdown.electricity.consumption,
          diesel: data.data.breakdown.diesel.consumption,
          petrol: data.data.breakdown.petrol.consumption,
          lpg: data.data.breakdown.lpg.consumption,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
  }, []);

  return { energyConsumption, loading, error };
};

// ============================================================================
// Example 2: Real-time IoT Sensor Data
// ============================================================================

/**
 * Real-time energy consumption from IoT sensors via WebSocket
 */
export const useLiveEnergyData = (deviceId: string) => {
  const [energyConsumption, setEnergyConsumption] = React.useState({
    electricity: 0,
    diesel: 0,
    petrol: 0,
    lpg: 0,
  });

  React.useEffect(() => {
    // Connect to WebSocket for real-time data
    const ws = new WebSocket(`wss://your-api.com/ws/energy-meters/${deviceId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      setEnergyConsumption((prev) => ({
        electricity: prev.electricity + (data.electricity || 0),
        diesel: prev.diesel + (data.diesel || 0),
        petrol: prev.petrol + (data.petrol || 0),
        lpg: prev.lpg + (data.lpg || 0),
      }));
    };

    return () => ws.close();
  }, [deviceId]);

  return energyConsumption;
};

// ============================================================================
// Example 3: Database Integration - MongoDB
// ============================================================================

/**
 * Backend code to fetch from MongoDB
 * File: backend/routes/energy.ts
 */

// import { MongoClient } from 'mongodb';
// 
// const client = new MongoClient(process.env.MONGODB_URI);
// 
// app.get('/api/energy-consumption/:month', async (req, res) => {
//   try {
//     const db = client.db('energy_monitoring');
//     const collection = db.collection('meter_readings');
//     
//     // Aggregate monthly data
//     const result = await collection.aggregate([
//       {
//         $match: {
//           timestamp: {
//             $gte: new Date(req.params.month),
//             $lt: new Date(new Date(req.params.month).getTime() + 30*24*60*60*1000)
//           }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           electricity: { $sum: '$electricity_kwh' },
//           diesel: { $sum: '$diesel_liters' },
//           petrol: { $sum: '$petrol_liters' },
//           lpg: { $sum: '$lpg_kg' }
//         }
//       }
//     ]).toArray();
//     
//     res.json(result[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// ============================================================================
// Example 4: Multi-Device Aggregation
// ============================================================================

/**
 * Fetch and aggregate data from multiple energy meters
 */
export const useMultiDeviceCarbonFootprint = (deviceIds: string[]) => {
  const [energyConsumption, setEnergyConsumption] = React.useState({
    electricity: 0,
    diesel: 0,
    petrol: 0,
    lpg: 0,
  });
  const [deviceStatus, setDeviceStatus] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const fetchAllDevices = async () => {
      const allData = {
        electricity: 0,
        diesel: 0,
        petrol: 0,
        lpg: 0,
      };
      const status: Record<string, boolean> = {};

      for (const deviceId of deviceIds) {
        try {
          const response = await fetch(`/api/energy-meter/${deviceId}`);
          const data = await response.json();
          
          allData.electricity += data.electricity || 0;
          allData.diesel += data.diesel || 0;
          allData.petrol += data.petrol || 0;
          allData.lpg += data.lpg || 0;
          
          status[deviceId] = true;
        } catch (error) {
          console.error(`Failed to fetch data from ${deviceId}`);
          status[deviceId] = false;
        }
      }

      setEnergyConsumption(allData);
      setDeviceStatus(status);
    };

    const interval = setInterval(fetchAllDevices, 60000); // Update every minute
    fetchAllDevices(); // Initial fetch

    return () => clearInterval(interval);
  }, [deviceIds]);

  return { energyConsumption, deviceStatus };
};

// ============================================================================
// Example 5: Daily Summary with Historical Data
// ============================================================================

/**
 * Fetch daily carbon footprint summaries with comparison to previous days
 */
export const useDailyFootprintHistory = (days: number = 30) => {
  const [history, setHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/carbon-footprint/daily-history?days=${days}`
        );
        const data = await response.json();
        setHistory(data.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [days]);

  return { history, loading };
};

// ============================================================================
// Example 6: Updated Sustainability Component
// ============================================================================

/**
 * Complete example of Sustainability component with real data
 * 
 * Replace in: src/app/components/Sustainability.tsx
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  calculateTotalCarbonFootprint,
  getTreeEquivalent,
  getEmissionBreakdown,
} from '../../utils/carbonFootprint';

export function SustainabilityWithRealData() {
  const [energyConsumption, setEnergyConsumption] = useState({
    electricity: 0,
    diesel: 0,
    petrol: 0,
    lpg: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch energy data from backend
  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        
        const response = await fetch(
          `/api/carbon-footprint/monthly/${year}/${month}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch energy data');
        
        const data = await response.json();
        
        setEnergyConsumption({
          electricity: data.data.breakdown.electricity.consumption,
          diesel: data.data.breakdown.diesel.consumption,
          petrol: data.data.breakdown.petrol.consumption,
          lpg: data.data.breakdown.lpg.consumption,
        });
        
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching energy data:', error);
        // Fallback to mock data
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

    fetchEnergyData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchEnergyData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate carbon emissions
  const carbonEmissions = useMemo(() => {
    return calculateTotalCarbonFootprint(energyConsumption);
  }, [energyConsumption]);

  const treeEquivalent = useMemo(() => {
    return getTreeEquivalent(carbonEmissions.total.emissionsTonnes);
  }, [carbonEmissions]);

  if (loading) {
    return <div>Loading energy data...</div>;
  }

  return (
    <div>
      {/* Your component JSX */}
      <h2>Carbon Footprint: {carbonEmissions.total.emissionsTonnes.toFixed(1)} tCO₂e</h2>
      {lastUpdated && (
        <p style={{ fontSize: 12, color: '#64748B' }}>
          Last updated: {lastUpdated.toLocaleString()}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Example 7: Export to Report (CSV, PDF)
// ============================================================================

/**
 * Generate CSV report of carbon emissions
 */
export const generateCarbonFootprintReport = (result: any) => {
  const csv = `
Energy Source,Consumption,Unit,Emission Factor,Total Emissions (kg),Total Emissions (tCO₂e)
Electricity,${result.breakdown.electricity.consumption},kWh,${result.emissionFactors.ELECTRICITY},${result.breakdown.electricity.emissions.toFixed(2)},${result.breakdown.electricity.emissionsTonnes.toFixed(2)}
Diesel,${result.breakdown.diesel.consumption},L,${result.emissionFactors.DIESEL},${result.breakdown.diesel.emissions.toFixed(2)},${result.breakdown.diesel.emissionsTonnes.toFixed(2)}
Petrol,${result.breakdown.petrol.consumption},L,${result.emissionFactors.PETROL},${result.breakdown.petrol.emissions.toFixed(2)},${result.breakdown.petrol.emissionsTonnes.toFixed(2)}
LPG,${result.breakdown.lpg.consumption},kg,${result.emissionFactors.LPG},${result.breakdown.lpg.emissions.toFixed(2)},${result.breakdown.lpg.emissionsTonnes.toFixed(2)}
Total,,,, ${result.total.emissions.toFixed(2)},${result.total.emissionsTonnes.toFixed(2)}
  `.trim();

  return csv;
};

// ============================================================================
// Example 8: Data Validation & Error Handling
// ============================================================================

/**
 * Validate energy consumption data
 */
export const validateEnergyConsumption = (data: any): boolean => {
  if (!data) return false;
  
  // Check if at least one value is provided
  if (!data.electricity && !data.diesel && !data.petrol && !data.lpg) {
    throw new Error('At least one energy source must have consumption data');
  }

  // Validate that all values are non-negative
  const values = [data.electricity, data.diesel, data.petrol, data.lpg];
  if (values.some(v => v && v < 0)) {
    throw new Error('Energy consumption values cannot be negative');
  }

  return true;
};

/**
 * Safe carbon footprint calculation with error handling
 */
export const safeCarbonCalculation = (input: any) => {
  try {
    validateEnergyConsumption(input);
    return calculateTotalCarbonFootprint(input);
  } catch (error: any) {
    console.error('Carbon calculation error:', error.message);
    return null;
  }
};
