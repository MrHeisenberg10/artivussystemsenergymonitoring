# Carbon Footprint Calculation Module - Documentation

## Overview

This module provides comprehensive carbon footprint calculations based on **Indian Standards** for greenhouse gas emissions. It calculates CO₂ equivalent (tCO₂e) emissions from various energy and fuel sources.

## Module Location

- **File**: `src/utils/carbonFootprint.ts`
- **Frontend Integration**: `src/app/components/Sustainability.tsx`

## Key Features

✅ **Indian Standard Emission Factors** - Based on official government standards  
✅ **Multiple Energy Sources** - Electricity, Diesel, Petrol, LPG  
✅ **Type-Safe Calculations** - Full TypeScript support  
✅ **Tree Equivalent Offset** - Visual representation of carbon offset  
✅ **Emission Breakdown** - Percentage contribution by source  

---

## Emission Factors (Indian Standards)

The following emission factors are used in the calculations:

| Energy Source | Unit | Emission Factor | Source |
|---|---|---|---|
| **Electricity** | kWh | 0.708 kg CO₂e | India Grid Average |
| **Diesel** | Liter | 2.68 kg CO₂e | MoEFCC Standard |
| **Petrol** | Liter | 2.31 kg CO₂e | Indian Standards |
| **LPG** | kg | 2.98 kg CO₂e | MoEFCC Standard |

---

## Calculation Formula

$$\text{Carbon Footprint} = \text{Activity Data} \times \text{Emission Factor}$$

### Example Calculation

#### Factory Monthly Consumption:
- Electricity: 100,000 kWh
- Diesel: 5,000 Liters
- Petrol: 1,000 Liters
- LPG: 500 kg

#### Calculations:

**Electricity:**
$$100,000 \text{ kWh} \times 0.708 = 70,800 \text{ kg CO}₂\text{e} = 70.8 \text{ tCO}₂\text{e}$$

**Diesel:**
$$5,000 \text{ L} \times 2.68 = 13,400 \text{ kg CO}₂\text{e} = 13.4 \text{ tCO}₂\text{e}$$

**Petrol:**
$$1,000 \text{ L} \times 2.31 = 2,310 \text{ kg CO}₂\text{e} = 2.31 \text{ tCO}₂\text{e}$$

**LPG:**
$$500 \text{ kg} \times 2.98 = 1,490 \text{ kg CO}₂\text{e} = 1.49 \text{ tCO}₂\text{e}$$

#### Total Carbon Footprint:
$$70.8 + 13.4 + 2.31 + 1.49 = 88 \text{ tCO}₂\text{e}$$

---

## API Reference

### 1. `calculateTotalCarbonFootprint(input: EnergyConsumptionInput)`

Main function that calculates complete carbon footprint.

**Parameters:**
```typescript
interface EnergyConsumptionInput {
  electricity?: number;  // kWh
  diesel?: number;       // Liters
  petrol?: number;       // Liters
  lpg?: number;          // kg
}
```

**Returns:**
```typescript
interface CarbonEmissionResult {
  electricity: { consumption, emissions, emissionsTonnes };
  diesel: { consumption, emissions, emissionsTonnes };
  petrol: { consumption, emissions, emissionsTonnes };
  lpg: { consumption, emissions, emissionsTonnes };
  total: { emissions, emissionsTonnes };
}
```

**Example:**
```typescript
import { calculateTotalCarbonFootprint } from '@/utils/carbonFootprint';

const result = calculateTotalCarbonFootprint({
  electricity: 100000,
  diesel: 5000,
  petrol: 1000,
  lpg: 500,
});

console.log(result.total.emissionsTonnes); // 88.0
```

---

### 2. Individual Calculation Functions

#### `calculateElectricityEmissions(kwhConsumed: number)`
Calculates emissions from electricity consumption in kWh.

```typescript
const result = calculateElectricityEmissions(100000);
// { emissions: 70800, emissionsTonnes: 70.8 }
```

#### `calculateDieselEmissions(litersConsumed: number)`
Calculates emissions from diesel consumption in Liters.

```typescript
const result = calculateDieselEmissions(5000);
// { emissions: 13400, emissionsTonnes: 13.4 }
```

#### `calculatePetrolEmissions(litersConsumed: number)`
Calculates emissions from petrol consumption in Liters.

```typescript
const result = calculatePetrolEmissions(1000);
// { emissions: 2310, emissionsTonnes: 2.31 }
```

#### `calculateLPGEmissions(kgConsumed: number)`
Calculates emissions from LPG consumption in kg.

```typescript
const result = calculateLPGEmissions(500);
// { emissions: 1490, emissionsTonnes: 1.49 }
```

---

### 3. Utility Functions

#### `getTreeEquivalent(emissionsTonnes: number)`
Calculates number of trees needed to offset carbon emissions.
(1 tree offsets ~20 kg CO₂e over its lifetime)

```typescript
const trees = getTreeEquivalent(88.0);
// 4400 trees
```

#### `getEmissionBreakdown(result: CarbonEmissionResult)`
Returns percentage contribution of each source.

```typescript
const breakdown = getEmissionBreakdown(result);
// {
//   electricity: "80.4",
//   diesel: "15.2",
//   petrol: "2.6",
//   lpg: "1.7"
// }
```

---

## Integration with Sustainability Component

The Sustainability component (`src/app/components/Sustainability.tsx`) is already integrated with the carbon footprint module:

### Current Implementation

```typescript
import { calculateTotalCarbonFootprint, getTreeEquivalent, getEmissionBreakdown } from '@/utils/carbonFootprint';

export function Sustainability() {
  const [energyConsumption] = useState({
    electricity: 100000, // Monthly consumption
    diesel: 5000,
    petrol: 1000,
    lpg: 500,
  });

  const carbonEmissions = useMemo(() => {
    return calculateTotalCarbonFootprint(energyConsumption);
  }, [energyConsumption]);

  const treeEquivalent = useMemo(() => {
    return getTreeEquivalent(carbonEmissions.total.emissionsTonnes);
  }, [carbonEmissions]);

  // ... component rendering with calculated values
}
```

### Displaying Calculations

The component displays:
1. **Carbon KPIs** - Total monthly emissions and breakdown by source
2. **Calculation Breakdown** - Shows formula and result for each energy source
3. **Environmental Impact** - Trees equivalent and emission percentages

---

## Backend Integration Guide

### Option 1: REST API Integration

To connect with a backend server, modify the `energyConsumption` state to fetch from an API:

```typescript
const [energyConsumption, setEnergyConsumption] = useState({
  electricity: 0,
  diesel: 0,
  petrol: 0,
  lpg: 0,
});

useEffect(() => {
  // Fetch from backend
  fetch('/api/energy-consumption')
    .then(res => res.json())
    .then(data => setEnergyConsumption(data));
}, []);
```

### Option 2: Real-time Data from Sensors

If you have IoT devices sending real-time data:

```typescript
useEffect(() => {
  const unsubscribe = subscribeToEnergyMeters((data) => {
    setEnergyConsumption({
      electricity: data.kwh,
      diesel: data.dieselLiters,
      petrol: data.petrolLiters,
      lpg: data.lpgKg,
    });
  });

  return () => unsubscribe();
}, []);
```

### Option 3: Database Query Integration

```typescript
useEffect(() => {
  const fetchMonthlyConsumption = async () => {
    const data = await db.query({
      collection: 'energy_meters',
      month: currentMonth,
    });
    
    setEnergyConsumption({
      electricity: data.electricity_kwh,
      diesel: data.diesel_liters,
      petrol: data.petrol_liters,
      lpg: data.lpg_kg,
    });
  };

  fetchMonthlyConsumption();
}, [currentMonth]);
```

---

## Backend Module Creation

To create a backend module (Node.js/Express example):

### Installation

```bash
npm install carbon-calc-india
```

### Usage

```typescript
// backend/routes/carbon.ts
import { calculateTotalCarbonFootprint } from '../utils/carbonFootprint';

app.post('/api/carbon-footprint', (req, res) => {
  const { electricity, diesel, petrol, lpg } = req.body;
  
  const result = calculateTotalCarbonFootprint({
    electricity,
    diesel,
    petrol,
    lpg,
  });
  
  res.json(result);
});
```

---

## Data Update Frequency

### Recommended Update Intervals:

| Source | Frequency | Unit |
|---|---|---|
| Electricity Meters | Hourly | kWh |
| Diesel Consumption | Daily | Liters |
| Petrol Consumption | Daily | Liters |
| LPG Consumption | Weekly | kg |
| Carbon Calculation | Real-time | tCO₂e |

---

## Performance Tips

1. **Memoization** - Use `useMemo` to avoid recalculations
2. **Batch Updates** - Update all consumption values together
3. **Caching** - Cache calculation results when data hasn't changed
4. **Debouncing** - For real-time data, debounce updates to avoid excessive recalculations

---

## Testing the Module

```typescript
import { exampleCalculation } from '@/utils/carbonFootprint';

const result = exampleCalculation();
console.log(result);
// Output:
// {
//   total: { emissions: 88000, emissionsTonnes: 88 },
//   electricity: { emissions: 70800, emissionsTonnes: 70.8, ... },
//   diesel: { emissions: 13400, emissionsTonnes: 13.4, ... },
//   ...
// }
```

---

## References

- **Ministry of Power**: [CO₂ Baseline Database for Indian Power Sector](https://cea.nic.in/)
- **MoEFCC**: [Greenhouse Gas Protocol - India](https://ghgprotocol.org/)
- **Indian Standards**: [Bureau of Indian Standards (BIS) - Energy Labels](https://www.bis.gov.in/)
- **ESG Guidelines**: [SEBI - Business Responsibility and Sustainability Reporting](https://www.sebi.gov.in/)

---

## Support & Updates

For updates to emission factors or new energy sources, modify `EMISSION_FACTORS` in the `carbonFootprint.ts` module.

Current Version: 1.0.0  
Last Updated: 2026-06-06
