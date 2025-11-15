"""API router module"""
from fastapi import APIRouter
from app.api.endpoints import chat, legal_templates, decisions, legislative_updates

router = APIRouter()

router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(
    legal_templates.router, prefix="/legal-templates", tags=["legal-templates"]
)
router.include_router(decisions.router, prefix="/decisions", tags=["decisions"])
router.include_router(
    legislative_updates.router,
    prefix="/legislative-updates",
    tags=["legislative-updates"],
)
