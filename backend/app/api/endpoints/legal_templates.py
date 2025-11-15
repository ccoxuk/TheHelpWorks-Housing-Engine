"""Legal templates endpoint for managing templates with version control"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.services.template_service import TemplateService

router = APIRouter()
template_service = TemplateService()


class LegalTemplate(BaseModel):
    """Legal template model"""

    id: Optional[int] = None
    name: str
    category: str
    content: str
    version: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class TemplateListResponse(BaseModel):
    """Response for template list"""

    templates: List[LegalTemplate]
    total: int


@router.get("/", response_model=TemplateListResponse)
async def list_templates(category: Optional[str] = None):
    """
    List all legal templates, optionally filtered by category
    """
    try:
        templates = await template_service.list_templates(category=category)
        return TemplateListResponse(templates=templates, total=len(templates))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{template_id}", response_model=LegalTemplate)
async def get_template(template_id: int):
    """
    Get a specific legal template by ID
    """
    try:
        template = await template_service.get_template(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        return template
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=LegalTemplate)
async def create_template(template: LegalTemplate):
    """
    Create a new legal template with version control
    """
    try:
        created_template = await template_service.create_template(template)
        return created_template
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{template_id}/versions")
async def get_template_versions(template_id: int):
    """
    Get version history for a legal template
    """
    try:
        versions = await template_service.get_template_versions(template_id)
        return {"versions": versions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
