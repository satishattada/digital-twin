from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Retail Asset Helpdesk API"
    }


@router.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to the Retail Asset Helpdesk API",
        "docs": "/docs",
        "health": "/health"
    }