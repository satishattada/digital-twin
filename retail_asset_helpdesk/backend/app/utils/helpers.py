import re
from typing import Optional
from app.schemas.assets import AssetCategory


CATEGORY_KEYWORDS = {
    AssetCategory.COFFEE_MACHINE: ["coffee", "espresso", "cappuccino", "barista", "brew"],
    AssetCategory.OVEN: ["oven", "bake", "roast", "convection"],
    AssetCategory.REFRIGERATOR: ["refrigerator", "fridge", "cooler", "cold storage"],
    AssetCategory.FREEZER: ["freezer", "freeze", "frozen"],
    AssetCategory.DISHWASHER: ["dishwasher", "dish", "wash"],
    AssetCategory.MICROWAVE: ["microwave", "micro"],
    AssetCategory.POS_TERMINAL: ["pos", "terminal", "payment", "register", "cash"],
    AssetCategory.DISPLAY_COOLER: ["display", "cooler", "showcase", "merchandiser"],
    AssetCategory.ICE_MACHINE: ["ice", "ice maker", "ice machine"],
    AssetCategory.HVAC: ["hvac", "heating", "ventilation", "air conditioning", "ac", "climate"],
}


def extract_category_from_filename(filename: str) -> Optional[str]:
    """Extract asset category from filename."""
    filename_lower = filename.lower()
    
    # Check for exact category match in filename
    for category in AssetCategory:
        if category.value in filename_lower:
            return category.value
    
    # Check for keyword matches
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in filename_lower:
                return category.value
    
    return None


def extract_doc_type_from_filename(filename: str) -> str:
    """Extract document type from filename."""
    filename_lower = filename.lower()
    
    if "manual" in filename_lower:
        return "manual"
    elif "troubleshoot" in filename_lower or "error" in filename_lower:
        return "troubleshooting"
    elif "maintenance" in filename_lower or "service" in filename_lower:
        return "maintenance"
    elif "warranty" in filename_lower:
        return "warranty"
    elif "parts" in filename_lower or "spare" in filename_lower:
        return "parts"
    else:
        return "manual"


def clean_text(text: str) -> str:
    """Clean and normalize text."""
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep punctuation
    text = re.sub(r'[^\w\s.,!?;:\-\'\"()]', '', text)
    return text.strip()