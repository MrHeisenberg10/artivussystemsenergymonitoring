/**
 * Carbon Footprint Calculation Module - Indian Standards
 * 
 * This module provides calculations for carbon emissions based on energy and fuel consumption
 * using Indian emission factors as per government standards.
 * 
 * Formula: Carbon Footprint = Activity Data × Emission Factor
 * 
 * Emission Factors (Indian Standards):
 * - Electricity: 0.708 kg CO₂e/kWh (India Grid Average)
 * - Diesel: 2.68 kg CO₂e/L
 * - Petrol: 2.31 kg CO₂e/L
 * - LPG: 2.98 kg CO₂e/kg
 */

// Emission Factors for India (in kg CO₂e per unit)
export const EMISSION_FACTORS = {
  ELECTRICITY: 0.708, // kg CO₂e/kWh - India Grid Average
  DIESEL: 2.68, // kg CO₂e/Liter
  PETROL: 2.31, // kg CO₂e/Liter
  LPG: 2.98, // kg CO₂e/kg
} as const;

// Conversion factors
export const CONVERSION_FACTORS = {
  KG_TO_TONNES: 1000, // 1 tonne = 1000 kg
} as const;

/**
 * Interface for fuel/energy consumption inputs
 */
export interface EnergyConsumptionInput {
  electricity?: number; // kWh
  diesel?: number; // Liters
  petrol?: number; // Liters
  lpg?: number; // kg
}

/**
 * Interface for carbon emission results
 */
export interface CarbonEmissionResult {
  electricity: {
    consumption: number; // kWh
    emissions: number; // kg CO₂e
    emissionsTonnes: number; // tCO₂e
  };
  diesel: {
    consumption: number; // Liters
    emissions: number; // kg CO₂e
    emissionsTonnes: number; // tCO₂e
  };
  petrol: {
    consumption: number; // Liters
    emissions: number; // kg CO₂e
    emissionsTonnes: number; // tCO₂e
  };
  lpg: {
    consumption: number; // kg
    emissions: number; // kg CO₂e
    emissionsTonnes: number; // tCO₂e
  };
  total: {
    emissions: number; // kg CO₂e
    emissionsTonnes: number; // tCO₂e
  };
}

/**
 * Calculate carbon emissions from electricity consumption
 * @param kwhConsumed - Electricity consumption in kWh
 * @returns Carbon emissions in kg CO₂e and tCO₂e
 */
export const calculateElectricityEmissions = (kwhConsumed: number = 0): {
  emissions: number;
  emissionsTonnes: number;
} => {
  const emissions = kwhConsumed * EMISSION_FACTORS.ELECTRICITY;
  return {
    emissions,
    emissionsTonnes: emissions / CONVERSION_FACTORS.KG_TO_TONNES,
  };
};

/**
 * Calculate carbon emissions from diesel consumption
 * @param litersConsumed - Diesel consumption in Liters
 * @returns Carbon emissions in kg CO₂e and tCO₂e
 */
export const calculateDieselEmissions = (litersConsumed: number = 0): {
  emissions: number;
  emissionsTonnes: number;
} => {
  const emissions = litersConsumed * EMISSION_FACTORS.DIESEL;
  return {
    emissions,
    emissionsTonnes: emissions / CONVERSION_FACTORS.KG_TO_TONNES,
  };
};

/**
 * Calculate carbon emissions from petrol consumption
 * @param litersConsumed - Petrol consumption in Liters
 * @returns Carbon emissions in kg CO₂e and tCO₂e
 */
export const calculatePetrolEmissions = (litersConsumed: number = 0): {
  emissions: number;
  emissionsTonnes: number;
} => {
  const emissions = litersConsumed * EMISSION_FACTORS.PETROL;
  return {
    emissions,
    emissionsTonnes: emissions / CONVERSION_FACTORS.KG_TO_TONNES,
  };
};

/**
 * Calculate carbon emissions from LPG consumption
 * @param kgConsumed - LPG consumption in kg
 * @returns Carbon emissions in kg CO₂e and tCO₂e
 */
export const calculateLPGEmissions = (kgConsumed: number = 0): {
  emissions: number;
  emissionsTonnes: number;
} => {
  const emissions = kgConsumed * EMISSION_FACTORS.LPG;
  return {
    emissions,
    emissionsTonnes: emissions / CONVERSION_FACTORS.KG_TO_TONNES,
  };
};

/**
 * Calculate total carbon footprint from all energy and fuel sources
 * 
 * Formula: Total Carbon Footprint = Σ(Activity Data × Emission Factor)
 * 
 * @param input - Object containing consumption values for each energy source
 * @returns Detailed breakdown of emissions by source and total emissions
 */
export const calculateTotalCarbonFootprint = (
  input: EnergyConsumptionInput
): CarbonEmissionResult => {
  const electricity = calculateElectricityEmissions(input.electricity);
  const diesel = calculateDieselEmissions(input.diesel);
  const petrol = calculatePetrolEmissions(input.petrol);
  const lpg = calculateLPGEmissions(input.lpg);

  const totalEmissions =
    electricity.emissions + diesel.emissions + petrol.emissions + lpg.emissions;

  return {
    electricity: {
      consumption: input.electricity || 0,
      emissions: electricity.emissions,
      emissionsTonnes: electricity.emissionsTonnes,
    },
    diesel: {
      consumption: input.diesel || 0,
      emissions: diesel.emissions,
      emissionsTonnes: diesel.emissionsTonnes,
    },
    petrol: {
      consumption: input.petrol || 0,
      emissions: petrol.emissions,
      emissionsTonnes: petrol.emissionsTonnes,
    },
    lpg: {
      consumption: input.lpg || 0,
      emissions: lpg.emissions,
      emissionsTonnes: lpg.emissionsTonnes,
    },
    total: {
      emissions: totalEmissions,
      emissionsTonnes: totalEmissions / CONVERSION_FACTORS.KG_TO_TONNES,
    },
  };
};

/**
 * Get carbon reduction equivalent in trees planted
 * (Approximately 1 tree offset = 20 kg CO₂e over its lifetime)
 * @param emissionsTonnes - Carbon emissions in tCO₂e
 * @returns Number of trees equivalent for carbon offset
 */
export const getTreeEquivalent = (emissionsTonnes: number): number => {
  const kgEmissions = emissionsTonnes * CONVERSION_FACTORS.KG_TO_TONNES;
  return Math.round(kgEmissions / 20); // 20 kg CO₂e per tree
};

/**
 * Calculate percentage contribution of each source to total emissions
 * @param result - Carbon emission result from calculateTotalCarbonFootprint
 * @returns Object with percentage contribution of each source
 */
export const getEmissionBreakdown = (result: CarbonEmissionResult) => {
  const total = result.total.emissions;
  return {
    electricity: total > 0 ? ((result.electricity.emissions / total) * 100).toFixed(1) : 0,
    diesel: total > 0 ? ((result.diesel.emissions / total) * 100).toFixed(1) : 0,
    petrol: total > 0 ? ((result.petrol.emissions / total) * 100).toFixed(1) : 0,
    lpg: total > 0 ? ((result.lpg.emissions / total) * 100).toFixed(1) : 0,
  };
};

/**
 * Example calculation (for documentation)
 * 
 * Factory Consumption:
 * - Electricity: 100,000 kWh
 * - Diesel: 5,000 Liters
 * - Petrol: 1,000 Liters
 * - LPG: 500 kg
 * 
 * Calculation:
 * - Electricity: 100,000 × 0.708 = 70,800 kg CO₂e = 70.8 tCO₂e
 * - Diesel: 5,000 × 2.68 = 13,400 kg CO₂e = 13.4 tCO₂e
 * - Petrol: 1,000 × 2.31 = 2,310 kg CO₂e = 2.31 tCO₂e
 * - LPG: 500 × 2.98 = 1,490 kg CO₂e = 1.49 tCO₂e
 * 
 * Total: 88 tCO₂e
 */
export const exampleCalculation = () => {
  const input: EnergyConsumptionInput = {
    electricity: 300000,
    diesel: 5000,
    petrol: 1000,
    lpg: 500,
  };

  return calculateTotalCarbonFootprint(input);
};
