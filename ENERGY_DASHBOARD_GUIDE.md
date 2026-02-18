# 🔋 Energy Metrics Dashboard - Quick Reference Guide

## Navigation
```
Facilities Manager Dashboard
├── 🏗️ Facility Assets (existing view)
└── ⚡ Energy Metrics (NEW!)
    ├── Top Consumers
    ├── Efficiency
    └── Trends
```

## Dashboard Sections

### 📊 Summary Cards (Top Row)
```
┌─────────────────────┬─────────────────────┬─────────────────────┬─────────────────────┐
│ Total Consumption   │ Peak Demand         │ Energy Generation   │ Net Consumption     │
│ ⚡ 1,100 kWh/day   │ 📊 380 kW          │ 🌞 206 kWh/day     │ 🔋 894 kWh/day     │
│ 401 MWh/year       │ Maximum load        │ From solar/storage  │ 18.7% offset       │
└─────────────────────┴─────────────────────┴─────────────────────┴─────────────────────┘
```

### 🔥 Top Consumers View
Shows the 10 highest energy-consuming assets:
```
#1  EV Chargers (AC/DC)           ████████████████████ 156.5 kWh/day  [T1] 🟢B
#2  HVAC Units                    ████████████████░░░░ 145.8 kWh/day  [T1] 🟡C
#3  Refrigeration (Chillers)      ████████████████░░░░ 125.6 kWh/day  [T1] 🟡C
#4  Refrigeration (Compressors)   ████████████░░░░░░░░  95.4 kWh/day  [T1] 🟡C
#5  Car Wash (Automatic)          ████████░░░░░░░░░░░░  85.2 kWh/day  [T2] 🟡C
...
```

**Generation (Negative Consumption):**
```
Solar PV                          🌞🌞🌞🌞🌞 +180.5 kWh/day (GENERATING)
Battery Storage                   🔋🔋 +25.4 kWh/day (DISCHARGING)
```

### ⭐ Efficiency View

**Rating Distribution:**
```
A-rated (Excellent)  ████████████░░░░░░░░ 13 assets (26%)
B-rated (Good)       ████████████████████ 21 assets (42%)  
C-rated (Fair)       ████████░░░░░░░░░░░░  9 assets (18%)
D-rated (Poor)       ██░░░░░░░░░░░░░░░░░░  1 asset  (2%)
```

**Improvement Opportunities:**
```
1. HVAC Units             145.8 kWh/day [C] → 💡 Save 21.9 kWh/day
2. Refrigeration          125.6 kWh/day [C] → 💡 Save 18.8 kWh/day
3. Car Wash                85.2 kWh/day [C] → 💡 Save 12.8 kWh/day
4. Ovens/Bakery            45.8 kWh/day [C] → 💡 Save  6.9 kWh/day
5. Water Heaters           32.5 kWh/day [C] → 💡 Save  4.9 kWh/day
```

### 📈 Trends View

**Critical Alerts (>10% increase):**
```
⚠️  HVAC Units              +25% ⬆️  145.8 kWh/day  [ALERT]
⚠️  Refrigeration           +22% ⬆️  125.6 kWh/day  [ALERT]
⚠️  EV Chargers             +18% ⬆️  156.5 kWh/day  [ALERT]
⚠️  Car Wash                +15% ⬆️   85.2 kWh/day  [ALERT]
⚠️  Ovens/Bakery            +12% ⬆️   45.8 kWh/day  [ALERT]
```

**Improving Efficiency:**
```
✅  EMS Controllers         -15% ⬇️    1.2 kWh/day  [GOOD]
✅  Canopy Lighting         -12% ⬇️   18.4 kWh/day  [GOOD]
✅  Parking Lot Lighting    -10% ⬇️   28.5 kWh/day  [GOOD]
✅  Water Recycling          -8% ⬇️   12.8 kWh/day  [GOOD]
```

### 📊 Category Breakdown
```
Forecourt        │ ████████░░ 218.2 kWh/day │ 13 assets
Refrigeration    │ ████████░░ 221.0 kWh/day │  2 assets
HVAC             │ ████████░░ 145.8 kWh/day │  1 asset
Car Wash         │ █████░░░░░ 113.4 kWh/day │  3 assets
Store Equipment  │ ████░░░░░░ 104.1 kWh/day │  5 assets
Energy           │ ████░░░░░░  98.3 kWh/day │  5 assets (net)
Exterior         │ ███░░░░░░░  44.3 kWh/day │  2 assets
Security         │ ██░░░░░░░░  27.0 kWh/day │  2 assets
...
```

## 🎨 Color Legend

### Efficiency Ratings
- 🟢 **A (Green)**: Excellent efficiency (>90%)
- 🔵 **B (Blue)**: Good efficiency (80-90%)
- 🟡 **C (Yellow)**: Fair efficiency (70-80%)
- 🔴 **D (Red)**: Poor efficiency (<70%)
- ⚪ **N/A (Gray)**: Not applicable (non-electrical)

### Trend Indicators
- 📈 **Red**: >10% increase (critical)
- 📊 **Orange**: 0-10% increase
- 📉 **Green**: Decreasing (improving)
- ➡️ **Gray**: Stable (0%)

### Asset Criticality
- 🔴 **T1**: Critical (mission-critical assets)
- 🟠 **T2**: Important (significant operational impact)
- 🟡 **T3**: Standard (routine operations)

## 💡 Key Insights

### Immediate Actions Required:
1. **HVAC System** - Schedule efficiency audit (+25% trend)
2. **Refrigeration** - Check compressor performance (+22% trend)
3. **EV Chargers** - Investigate increased usage pattern (+18% trend)
4. **Car Wash** - Review water/energy systems (+15% trend)

### Optimization Opportunities:
- Upgrade 9 C-rated assets → Potential savings: ~70 kWh/day
- Improve solar panel cleaning → Increase generation by 5%
- Optimize HVAC schedule → Reduce consumption by 20%
- Install smart controls → 10-15% overall reduction

### Energy Balance:
- Current self-sufficiency: **18.7%**
- Target with optimizations: **30%+**
- Annual energy cost savings potential: **£15,000-£20,000**

## 🔍 How to Use

1. **Regular Monitoring**: Check trends weekly
2. **Alert Response**: Address critical trends (>10%) within 48 hours
3. **Efficiency Audits**: Review C/D-rated assets quarterly
4. **Optimization Planning**: Target high-consumption + low-efficiency assets first
5. **ROI Tracking**: Monitor savings from efficiency improvements

## 📱 Quick Actions

From the dashboard you can:
- ✅ Identify top energy consumers instantly
- ✅ Track 30-day consumption trends
- ✅ Find improvement opportunities
- ✅ Estimate potential savings
- ✅ Monitor renewable energy generation
- ✅ Compare categories and assets
- ✅ Export data for reporting

---

**Pro Tip**: Focus on assets that are BOTH high-consumption AND low-efficiency (C/D rating) for maximum ROI on improvements!
