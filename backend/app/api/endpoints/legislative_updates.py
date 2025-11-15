"""Legislative updates endpoint for automated legislative tracking"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.services.legislative_service import LegislativeService

router = APIRouter()
legislative_service = LegislativeService()


class LegislativeUpdate(BaseModel):
    """Legislative update model"""

    id: Optional[int] = None
    title: str
    description: str
    source: str
    jurisdiction: str
    effective_date: Optional[datetime] = None
    impact_level: str
    created_at: Optional[datetime] = None


class UpdateListResponse(BaseModel):
    """Response for updates list"""

    updates: List[LegislativeUpdate]
    total: int


@router.get("/", response_model=UpdateListResponse)
async def list_updates(jurisdiction: Optional[str] = None):
    """
    List legislative updates, optionally filtered by jurisdiction
    """
    try:
        updates = await legislative_service.list_updates(jurisdiction=jurisdiction)
        return UpdateListResponse(updates=updates, total=len(updates))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{update_id}", response_model=LegislativeUpdate)
async def get_update(update_id: int):
    """
    Get a specific legislative update
    """
    try:
        update = await legislative_service.get_update(update_id)
        if not update:
            raise HTTPException(status_code=404, detail="Update not found")
        return update
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sync")
async def sync_updates():
    """
    Trigger manual sync of legislative updates
    """
    try:
        result = await legislative_service.sync_legislative_updates()
        return {"status": "success", "updates_processed": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
