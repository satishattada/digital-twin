# Asset Details Page - Feature Documentation

## Overview
Enhanced asset details page showing comprehensive information about retail assets including configuration, maintenance history, and issue tracking.

## Features

### 1. **Overview Tab** 📊
- **Statistics Dashboard**: Quick metrics showing:
  - Total maintenance records
  - Number of issues reported
  - Total maintenance cost
  - Issue resolution rate
- **Recent Activity Timeline**: Latest 3 maintenance activities with dates and details

### 2. **Configuration Tab** ⚙️
- **Technical Specifications**: Complete asset configuration details
  - Voltage and Power ratings
  - Capacity specifications
  - Physical dimensions and weight
  - Connectivity features (Wi-Fi, etc.)

### 3. **Maintenance History Tab** 🔧
Shows **last 6 months** of maintenance records with:
- **Record Type Badges**: Routine, Preventive, Corrective, Emergency
- **Maintenance Details**:
  - Date of service
  - Description of work performed
  - Technician name
  - Cost breakdown
  - Parts replaced
  - Next due date (if applicable)

#### Maintenance Types
- 🟢 **Routine**: Regular scheduled maintenance
- 🔵 **Preventive**: Preventive checks and servicing
- 🟠 **Corrective**: Repairs and fixes
- 🔴 **Emergency**: Urgent repairs

### 4. **Issues Tab** ⚠️
Shows **last 12 months** of reported issues with:
- **Issue Details**:
  - Reported and resolved dates
  - Issue type and severity
  - Detailed description
  - Resolution steps taken
  - Downtime duration
  - Repair cost
- **Severity Levels**:
  - 🟢 Low
  - 🟠 Medium
  - 🔴 High
  - ⚫ Critical
- **Status Tracking**: Resolved/Pending

### 5. **Ask AI Tab** 💬
- Chat interface for asset-specific questions
- Quick suggestion buttons for common queries:
  - How to perform maintenance
  - Common issues
  - Troubleshooting guide
  - Parts replacement schedule

## Example: Coffee Machine Asset

### Sample Data Structure
```typescript
{
  name: "Coffee Machine - Store 001",
  manufacturer: "BrewMaster",
  model: "BM-3000",
  category: "food_service",
  serialNumber: "CM001-2023",
  location: "Break Room",
  status: "operational",
  installationDate: "2023-06-15",
  warrantyExpiry: "2026-06-15",
  
  specifications: {
    voltage: "220V AC",
    power: "1450W",
    capacity: "12 cups",
    dimensions: "35cm x 25cm x 45cm",
    weight: "6.5 kg",
    connectivity: "Wi-Fi enabled"
  }
}
```

### Maintenance History Example (6 months)
1. **Feb 2026** - Routine cleaning and descaling ($85)
2. **Jan 2026** - Preventive maintenance ($120)
3. **Dec 2025** - Brewing unit replacement ($250)
4. **Nov 2025** - Monthly maintenance ($75)
5. **Oct 2025** - Cleaning and inspection ($65)
6. **Sep 2025** - Emergency water leak repair ($180)

**Total Maintenance Cost**: $775

### Issue History Example (12 months)
1. **Feb 2026** - Water flow issue (Medium, 2 hours downtime, $45)
2. **Dec 2025** - Brewing failure (High, 2 days downtime, $250)
3. **Nov 2025** - Temperature inconsistency (Low, 1 hour, $35)
4. **Sep 2025** - Water leak (Critical, 2 days, $180)
5. **Jul 2025** - Grinder jam (Medium, 3 hours, $60)
6. **May 2025** - Display error (Low, 1 day, $95)
7. **Apr 2025** - Weak coffee (Low, 2 hours, $40)
8. **Mar 2025** - Power issue (High, 2 days, $220)

**Total Issues**: 8
**Resolved**: 8/8 (100%)
**Total Issue Cost**: $925

## Technical Implementation

### File Structure
```
frontend/src/app/assets/[id]/
├── page.tsx                    # Main component with tabs
└── asset-details.module.css    # Comprehensive styling
```

### Dependencies
- Next.js 14 App Router
- React 18
- TypeScript
- CSS Modules

### API Integration
```typescript
// Fetch asset with enhanced data
const asset = await api.getAsset(assetId);

// Currently using mock data for:
// - specifications
// - maintenanceHistory
// - issueHistory
```

## Future Enhancements

### Backend Integration
- [ ] API endpoints for maintenance records
- [ ] API endpoints for issue tracking
- [ ] Real-time asset status updates
- [ ] Notification system for upcoming maintenance

### Features
- [ ] Export maintenance reports to PDF
- [ ] Filter and sort maintenance/issue records
- [ ] Visual analytics charts
- [ ] Maintenance scheduling interface
- [ ] Parts inventory integration
- [ ] Cost trend analysis
- [ ] Predictive maintenance alerts

### UI Improvements
- [ ] Mobile responsive design
- [ ] Print-friendly layouts
- [ ] Dark/Light theme toggle
- [ ] Customizable dashboard widgets

## Navigation Flow

```
Home (/)
  ↓
Asset Inventory (/assets)
  ↓ [Click on asset card]
Asset Details (/assets/[id])
  ├── Overview Tab (default)
  ├── Configuration Tab
  ├── Maintenance Tab (6M)
  ├── Issues Tab (1Y)
  └── Ask AI Tab
```

## Usage

1. **View Assets**: Navigate to `/assets` to see all assets
2. **Select Asset**: Click on any asset card to view details
3. **Explore Tabs**: Switch between different information tabs
4. **Review History**: Check maintenance and issue records
5. **Ask Questions**: Use the AI chat for asset-specific queries

## Styling Highlights

### Color Scheme
- Background: Dark gradient (#1a1f2e to #2d3748)
- Text: Light gray (#e2e8f0)
- Accents: Indigo (#6366f1)
- Status Colors: Green (operational), Amber (maintenance), Red (faulty)

### Maintenance Type Colors
- Routine: Green
- Preventive: Blue
- Corrective: Orange
- Emergency: Red

### Severity Colors
- Low: Green
- Medium: Orange
- High: Red
- Critical: Dark Red

## Key Features for Decision Making

### For Facility Managers
- Quick overview of asset health
- Maintenance cost tracking
- Issue resolution monitoring
- Historical performance data

### For Technicians
- Complete maintenance history
- Issue patterns and resolutions
- Parts replacement tracking
- Technical specifications

### For Administrators
- Cost analysis and budgeting
- Asset lifecycle management
- Preventive maintenance planning
- Performance metrics

---

**Version**: 1.0.0
**Last Updated**: February 2026
**Author**: Retail Asset Management Team
