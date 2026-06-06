/**
 * Backend Carbon Footprint API - Node.js/Express Implementation
 * 
 * This is a reference implementation for integrating carbon footprint calculations
 * with your backend API. Place this in your backend project.
 * 
 * File: backend/utils/carbonFootprintBackend.ts (or .js)
 */

/**
 * Emission Factors (Indian Standards)
 */
const EMISSION_FACTORS = {
  ELECTRICITY: 0.708, // kg CO₂e/kWh
  DIESEL: 2.68, // kg CO₂e/Liter
  PETROL: 2.31, // kg CO₂e/Liter
  LPG: 2.98, // kg CO₂e/kg
};

/**
 * Database-like structure for storing energy meter readings
 * Replace with your actual database
 */
class EnergyConsumptionDB {
  private readings: any[] = [];

  /**
   * Store energy meter reading
   */
  storeReading(deviceId: string, timestamp: Date, data: any) {
    this.readings.push({
      deviceId,
      timestamp,
      ...data,
    });
  }

  /**
   * Get readings for a specific period
   */
  getReadings(startDate: Date, endDate: Date, deviceId?: string) {
    return this.readings.filter(r => 
      r.timestamp >= startDate && 
      r.timestamp <= endDate && 
      (!deviceId || r.deviceId === deviceId)
    );
  }

  /**
   * Get aggregated monthly data
   */
  getMonthlyAggregation(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const readings = this.getReadings(startDate, endDate);
    
    return {
      electricity: readings.reduce((sum, r) => sum + (r.electricity || 0), 0),
      diesel: readings.reduce((sum, r) => sum + (r.diesel || 0), 0),
      petrol: readings.reduce((sum, r) => sum + (r.petrol || 0), 0),
      lpg: readings.reduce((sum, r) => sum + (r.lpg || 0), 0),
    };
  }
}

/**
 * Carbon Footprint Calculator Service
 */
class CarbonFootprintService {
  private db: EnergyConsumptionDB;

  constructor(database?: EnergyConsumptionDB) {
    this.db = database || new EnergyConsumptionDB();
  }

  /**
   * Calculate emissions from electricity (kWh)
   */
  calculateElectricityEmissions(kwhConsumed: number) {
    const emissions = kwhConsumed * EMISSION_FACTORS.ELECTRICITY;
    return {
      emissions, // kg CO₂e
      emissionsTonnes: emissions / 1000, // tCO₂e
      unit: 'kWh',
      emissionFactor: EMISSION_FACTORS.ELECTRICITY,
    };
  }

  /**
   * Calculate emissions from diesel (Liters)
   */
  calculateDieselEmissions(litersConsumed: number) {
    const emissions = litersConsumed * EMISSION_FACTORS.DIESEL;
    return {
      emissions,
      emissionsTonnes: emissions / 1000,
      unit: 'Liters',
      emissionFactor: EMISSION_FACTORS.DIESEL,
    };
  }

  /**
   * Calculate emissions from petrol (Liters)
   */
  calculatePetrolEmissions(litersConsumed: number) {
    const emissions = litersConsumed * EMISSION_FACTORS.PETROL;
    return {
      emissions,
      emissionsTonnes: emissions / 1000,
      unit: 'Liters',
      emissionFactor: EMISSION_FACTORS.PETROL,
    };
  }

  /**
   * Calculate emissions from LPG (kg)
   */
  calculateLPGEmissions(kgConsumed: number) {
    const emissions = kgConsumed * EMISSION_FACTORS.LPG;
    return {
      emissions,
      emissionsTonnes: emissions / 1000,
      unit: 'kg',
      emissionFactor: EMISSION_FACTORS.LPG,
    };
  }

  /**
   * Calculate total carbon footprint
   */
  calculateTotalCarbonFootprint(consumption: {
    electricity?: number;
    diesel?: number;
    petrol?: number;
    lpg?: number;
  }) {
    const electricity = this.calculateElectricityEmissions(consumption.electricity || 0);
    const diesel = this.calculateDieselEmissions(consumption.diesel || 0);
    const petrol = this.calculatePetrolEmissions(consumption.petrol || 0);
    const lpg = this.calculateLPGEmissions(consumption.lpg || 0);

    const totalEmissions = electricity.emissions + diesel.emissions + petrol.emissions + lpg.emissions;

    return {
      breakdown: {
        electricity: { consumption: consumption.electricity || 0, ...electricity },
        diesel: { consumption: consumption.diesel || 0, ...diesel },
        petrol: { consumption: consumption.petrol || 0, ...petrol },
        lpg: { consumption: consumption.lpg || 0, ...lpg },
      },
      total: {
        emissions: totalEmissions,
        emissionsTonnes: totalEmissions / 1000,
      },
      emissionFactors: EMISSION_FACTORS,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get monthly carbon footprint
   */
  getMonthlyFootprint(year: number, month: number) {
    const data = this.db.getMonthlyAggregation(year, month);
    return this.calculateTotalCarbonFootprint(data);
  }

  /**
   * Get tree equivalent for offset
   */
  getTreeEquivalent(emissionsTonnes: number): number {
    return Math.round((emissionsTonnes * 1000) / 20); // 20 kg CO₂e per tree
  }

  /**
   * Get emission breakdown percentages
   */
  getEmissionBreakdown(result: any) {
    const total = result.total.emissions;
    return {
      electricity: total > 0 ? ((result.breakdown.electricity.emissions / total) * 100).toFixed(1) : 0,
      diesel: total > 0 ? ((result.breakdown.diesel.emissions / total) * 100).toFixed(1) : 0,
      petrol: total > 0 ? ((result.breakdown.petrol.emissions / total) * 100).toFixed(1) : 0,
      lpg: total > 0 ? ((result.breakdown.lpg.emissions / total) * 100).toFixed(1) : 0,
    };
  }
}

/**
 * Express API Endpoints
 * 
 * Add these routes to your Express server:
 */

// Express example setup
export const setupCarbonFootprintRoutes = (app: any) => {
  const service = new CarbonFootprintService();

  /**
   * POST /api/carbon-footprint
   * Calculate carbon footprint for given energy consumption
   */
  app.post('/api/carbon-footprint', (req: any, res: any) => {
    try {
      const { electricity, diesel, petrol, lpg } = req.body;

      if (!electricity && !diesel && !petrol && !lpg) {
        return res.status(400).json({
          error: 'At least one energy consumption value is required',
        });
      }

      const result = service.calculateTotalCarbonFootprint({
        electricity,
        diesel,
        petrol,
        lpg,
      });

      const breakdown = service.getEmissionBreakdown(result);
      const trees = service.getTreeEquivalent(result.total.emissionsTonnes);

      res.json({
        success: true,
        data: {
          ...result,
          breakdown: {
            ...breakdown,
            treeEquivalent: trees,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  /**
   * GET /api/carbon-footprint/monthly/:year/:month
   * Get carbon footprint for a specific month
   */
  app.get('/api/carbon-footprint/monthly/:year/:month', (req: any, res: any) => {
    try {
      const { year, month } = req.params;
      const result = service.getMonthlyFootprint(parseInt(year), parseInt(month));
      const breakdown = service.getEmissionBreakdown(result);

      res.json({
        success: true,
        data: {
          ...result,
          breakdown,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  /**
   * POST /api/carbon-footprint/store-reading
   * Store energy meter reading from IoT device
   */
  app.post('/api/carbon-footprint/store-reading', (req: any, res: any) => {
    try {
      const { deviceId, electricity, diesel, petrol, lpg } = req.body;

      if (!deviceId) {
        return res.status(400).json({ error: 'Device ID is required' });
      }

      const db = new EnergyConsumptionDB();
      db.storeReading(deviceId, new Date(), {
        electricity,
        diesel,
        petrol,
        lpg,
      });

      res.json({
        success: true,
        message: 'Energy reading stored successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  });

  /**
   * GET /api/carbon-footprint/emission-factors
   * Get current emission factors used
   */
  app.get('/api/carbon-footprint/emission-factors', (req: any, res: any) => {
    res.json({
      success: true,
      data: EMISSION_FACTORS,
      unit: 'kg CO₂e per unit',
      source: 'Indian Standards',
    });
  });
};

export { CarbonFootprintService, EnergyConsumptionDB };
