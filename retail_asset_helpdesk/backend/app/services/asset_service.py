from typing import List, Dict, Optional
from app.schemas.assets import Asset, AssetStats, AssetCategory, AssetStatus


class AssetService:
    """Service for managing retail assets."""
    
    def __init__(self):
        # In a real application, this would connect to a database
        # For now, we'll use sample data
        self._assets: Dict[str, Asset] = {}
        self._load_sample_assets()
    
    def _load_sample_assets(self):
        """Load sample asset data."""
        sample_assets = [
            # Coffee Machines
            Asset(
                id="1",
                name="Coffee Machine - Store 001",
                category=AssetCategory.COFFEE_MACHINE,
                model="BM-3000",
                manufacturer="BrewMaster",
                location="Break Room - Floor 1",
                status=AssetStatus.FAULTY,
                lastMaintenance="2026-02-10",
                serialNumber="CM001-2023",
                contactName="John Smith",
                contactEmail="john.smith@bp.com",
                contactPhone="+1 (555) 123-4567"
            ),
            Asset(
                id="CM002",
                name="Espresso Machine - Counter",
                category=AssetCategory.COFFEE_MACHINE,
                model="Magnifica S",
                manufacturer="DeLonghi",
                location="Store Front - Counter A",
                status=AssetStatus.FAULTY,
                lastMaintenance="2026-01-25",
                serialNumber="DL-MAG-2024-001",
                contactName="Sarah Johnson",
                contactEmail="sarah.johnson@bp.com",
                contactPhone="+1 (555) 234-5678"
            ),
            Asset(
                id="CM003",
                name="Commercial Coffee Maker",
                category=AssetCategory.COFFEE_MACHINE,
                model="Airpot Brewer",
                manufacturer="Bunn",
                location="Cafeteria - Station 2",
                status=AssetStatus.MAINTENANCE,
                lastMaintenance="2025-12-15",
                serialNumber="BN-APB-2023-078",
                contactName="Mike Davis",
                contactEmail="mike.davis@bp.com",
                contactPhone="+1 (555) 345-6789"
            ),
            Asset(
                id="CM004",
                name="Single Serve Coffee Station",
                category=AssetCategory.COFFEE_MACHINE,
                model="K-3500",
                manufacturer="Keurig",
                location="Office - 3rd Floor",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-02-01",
                serialNumber="KG-K35-2024-442",
                contactName="Emily Chen",
                contactEmail="emily.chen@bp.com",
                contactPhone="+1 (555) 456-7890"
            ),
            
            # HVAC Systems
            Asset(
                id="HVAC001",
                name="Main HVAC Unit - North",
                category=AssetCategory.HVAC,
                model="RTU-150",
                manufacturer="Carrier",
                location="Rooftop - North Section",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-01-20",
                serialNumber="CR-RTU-2020-301"
            ),
            Asset(
                id="HVAC002",
                name="HVAC System - South Wing",
                category=AssetCategory.HVAC,
                model="Comfort Series",
                manufacturer="Trane",
                location="Rooftop - South Section",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-02-05",
                serialNumber="TR-CS-2021-189"
            ),
            Asset(
                id="HVAC003",
                name="Air Handler - Main Floor",
                category=AssetCategory.HVAC,
                model="AHU-500",
                manufacturer="Lennox",
                location="Mechanical Room A",
                status=AssetStatus.MAINTENANCE,
                lastMaintenance="2025-11-30",
                serialNumber="LX-AHU-2019-567"
            ),
            Asset(
                id="HVAC004",
                name="Split System - Storage",
                category=AssetCategory.HVAC,
                model="Mini-Split 24K",
                manufacturer="Mitsubishi",
                location="Cold Storage Room",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-01-10",
                serialNumber="MT-MS24-2022-834"
            ),
            
            # Freezers
            Asset(
                id="FRZ001",
                name="Walk-in Freezer - Main",
                category=AssetCategory.FREEZER,
                model="FreezePro 3000",
                manufacturer="Kolpak",
                location="Storage Room A",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-02-08",
                serialNumber="KP-FP3-2021-445"
            ),
            Asset(
                id="FRZ002",
                name="Chest Freezer - Backup",
                category=AssetCategory.FREEZER,
                model="CF-28",
                manufacturer="True",
                location="Storage Room B",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-01-18",
                serialNumber="TR-CF28-2023-991"
            ),
            Asset(
                id="FRZ003",
                name="Display Freezer - Ice Cream",
                category=AssetCategory.FREEZER,
                model="GDM-26F",
                manufacturer="True",
                location="Store Front - West Wall",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-02-12",
                serialNumber="TR-GDM26-2022-334"
            ),
            Asset(
                id="FRZ004",
                name="Reach-in Freezer",
                category=AssetCategory.FREEZER,
                model="T-49F",
                manufacturer="True",
                location="Kitchen - Prep Area",
                status=AssetStatus.FAULTY,
                lastMaintenance="2025-10-22",
                serialNumber="TR-T49F-2020-778"
            ),
            
            # Ovens
            Asset(
                id="OV001",
                name="Convection Oven - Main",
                category=AssetCategory.OVEN,
                model="Professional Series 500",
                manufacturer="Viking",
                location="Kitchen - Station 1",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-02-01",
                serialNumber="VK-PS5-2023-042"
            ),
            Asset(
                id="OV002",
                name="Double Deck Pizza Oven",
                category=AssetCategory.OVEN,
                model="DDO-2000",
                manufacturer="Blodgett",
                location="Kitchen - Pizza Station",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-01-28",
                serialNumber="BL-DDO-2022-615"
            ),
            Asset(
                id="OV003",
                name="Combi Oven",
                category=AssetCategory.OVEN,
                model="SelfCookingCenter",
                manufacturer="Rational",
                location="Kitchen - Station 2",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-02-14",
                serialNumber="RT-SCC-2023-229"
            ),
            Asset(
                id="OV004",
                name="Commercial Microwave",
                category=AssetCategory.MICROWAVE,
                model="R-21LCF",
                manufacturer="Sharp",
                location="Kitchen - Quick Service",
                status=AssetStatus.MAINTENANCE,
                lastMaintenance="2025-12-05",
                serialNumber="SH-R21-2024-881"
            ),
            
            # Additional Equipment
            Asset(
                id="RF001",
                name="Walk-in Refrigerator",
                category=AssetCategory.REFRIGERATOR,
                model="ColdMaster 3000",
                manufacturer="TrueTemp",
                location="Storage Room A",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-02-03",
                serialNumber="TT-CM3-2022-118"
            ),
            Asset(
                id="POS001",
                name="Register 1",
                category=AssetCategory.POS_TERMINAL,
                model="Square Terminal",
                manufacturer="Square",
                location="Store Front - Register 1",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-01-01",
                serialNumber="SQ-T-2024-555"
            ),
            Asset(
                id="DC001",
                name="Beverage Display Cooler",
                category=AssetCategory.DISPLAY_COOLER,
                model="GDM-49",
                manufacturer="True",
                location="Store Front - East Wall",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-01-22",
                serialNumber="TR-GDM-2021-892"
            ),
            Asset(
                id="DW001",
                name="Commercial Dishwasher",
                category=AssetCategory.DISHWASHER,
                model="High Temp 44",
                manufacturer="Hobart",
                location="Kitchen - Dish Area",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-02-07",
                serialNumber="HB-HT44-2022-456"
            ),
            Asset(
                id="ICE001",
                name="Ice Machine",
                category=AssetCategory.ICE_MACHINE,
                model="Prodigy Plus",
                manufacturer="Scotsman",
                location="Kitchen - Beverage Station",
                status=AssetStatus.OPERATIONAL,
                lastMaintenance="2026-01-30",
                serialNumber="SC-PP-2023-723"
            ),
        ]
        
        for asset in sample_assets:
            self._assets[asset.id] = asset
    
    def get_all_assets(self) -> List[Asset]:
        """Get all assets."""
        return list(self._assets.values())
    
    def get_asset(self, asset_id: str) -> Optional[Asset]:
        """Get a specific asset by ID."""
        return self._assets.get(asset_id)
    
    def get_assets_by_category(self, category: AssetCategory) -> List[Asset]:
        """Get assets by category."""
        return [a for a in self._assets.values() if a.category == category]
    
    def get_assets_by_status(self, status: AssetStatus) -> List[Asset]:
        """Get assets by status."""
        return [a for a in self._assets.values() if a.status == status]
    
    def get_stats(self) -> AssetStats:
        """Get asset statistics."""
        assets = list(self._assets.values())
        
        by_category = {}
        for category in AssetCategory:
            count = sum(1 for a in assets if a.category == category)
            if count > 0:
                by_category[category.value] = count
        
        by_status = {}
        for status in AssetStatus:
            count = sum(1 for a in assets if a.status == status)
            if count > 0:
                by_status[status.value] = count
        
        return AssetStats(
            total=len(assets),
            by_category=by_category,
            by_status=by_status
        )