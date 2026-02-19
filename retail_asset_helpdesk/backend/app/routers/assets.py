from typing import List, Optional
from fastapi import APIRouter, HTTPException

from app.schemas.assets import Asset, AssetStats, AssetCategory, AssetStatus
from app.services.asset_service import AssetService

router = APIRouter(prefix="/assets", tags=["Assets"])

# Initialize service
asset_service = AssetService()


@router.get("", response_model=List[Asset])
async def get_assets(
    category: Optional[AssetCategory] = None,
    status: Optional[AssetStatus] = None
):
    """Get all assets with optional filtering."""
    if category:
        return asset_service.get_assets_by_category(category)
    if status:
        return asset_service.get_assets_by_status(status)
    return asset_service.get_all_assets()


@router.get("/stats", response_model=AssetStats)
async def get_asset_stats():
    """Get asset statistics."""
    return asset_service.get_stats()


@router.get("/{asset_id}", response_model=Asset)
async def get_asset(asset_id: str):
    """Get a specific asset by ID."""
    asset = asset_service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset