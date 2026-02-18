from typing import Optional, List, Dict
from enum import Enum
from pydantic import BaseModel


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
    last_maintenance: str
    serial_number: str


class AssetStats(BaseModel):
    total: int
    by_category: Dict[str, int]
    by_status: Dict[str, int]