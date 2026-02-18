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
            Asset(
                id="CM001",
                name="Main Counter Coffee Machine",
                category=AssetCategory.COFFEE_MACHINE,
                model="Magnifica S",
                manufacturer="DeLonghi",
                location="Store Front - Counter A",
                status=AssetStatus.OPERATIONAL,
                last_maintenance="2025-01-15",
                serial_number="DL-MAG-2024-001"
            ),
            Asset(
                id="OV001",
                name="Kitchen Convection Oven",
                category=AssetCategory.OVEN,
                model="Professional Series 500",
                manufacturer="Viking",
                location="Kitchen - Station 1",
                status=AssetStatus.OPERATIONAL,
                last_maintenance="2025-02-01",
                serial_number="VK-PS5-2023-042"
            ),
            Asset(
                id="RF001",
                name="Walk-in Refrigerator",
                category=AssetCategory.REFRIGERATOR,
                model="ColdMaster 3000",
                manufacturer="TrueTemp",
                location="Storage Room A",
                status=AssetStatus.MAINTENANCE,
                last_maintenance="2024-12-20",
                serial_number="TT-CM3-2022-118"
            ),
            Asset(
                id="POS001",
                name="Register 1",
                category=AssetCategory.POS_TERMINAL,
                model="Square Terminal",
                manufacturer="Square",
                location="Store Front - Register 1",
                status=AssetStatus.OPERATIONAL,
                last_maintenance="2025-01-01",
                serial_number="SQ-T-2024-555"
            ),
            Asset(
                id="DC001",
                name="Beverage Display Cooler",
                category=AssetCategory.DISPLAY_COOLER,
                model="GDM-49",
                manufacturer="True",
                location="Store Front - East Wall",
                status=AssetStatus.FAULTY,
                last_maintenance="2024-11-15",
                serial_number="TR-GDM-2021-892"
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