from typing import Optional, List, Dict
from enum import Enum
from pydantic import BaseModel, Field


class AssetCategory(str, Enum):
    COFFEE_MACHINE = "coffee_machine"
    OVEN = "oven"
    REFRIGERATOR = "refrigerator"
    FREEZER = "freezer"
    DISHWASHER = "dishwasher"
    MICROWAVE = "microwave"
    POS_TERMINAL = "pos_terminal"
    DISPLAY_COOLER = "display_cooler"
    ICE_MACHINE = "ice_machine"
    HVAC = "hvac"


class AssetStatus(str, Enum):
    OPERATIONAL = "operational"
    MAINTENANCE = "maintenance"
    FAULTY = "faulty"
    OFFLINE = "offline"


class Asset(BaseModel):
    id: str
    name: str
    category: AssetCategory
    model: str
    manufacturer: str
    location: str
    status: AssetStatus
    lastMaintenance: str = Field(serialization_alias='lastMaintenance')
    serialNumber: str = Field(serialization_alias='serialNumber')
    contactName: Optional[str] = Field(default=None, serialization_alias='contactName')
    contactEmail: Optional[str] = Field(default=None, serialization_alias='contactEmail')
    contactPhone: Optional[str] = Field(default=None, serialization_alias='contactPhone')
    
    class Config:
        populate_by_name = True


class AssetStats(BaseModel):
    total: int
    byCategory: Dict[str, int] = Field(serialization_alias='byCategory')
    byStatus: Dict[str, int] = Field(serialization_alias='byStatus')