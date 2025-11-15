"""Chat endpoint for AI/GPT-based Q&A processing"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.ai_service import AIService

router = APIRouter()
ai_service = AIService()


class ChatMessage(BaseModel):
    """Chat message model"""

    role: str
    content: str


class ChatRequest(BaseModel):
    """Chat request model"""

    messages: List[ChatMessage]
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    """Chat response model"""

    message: str
    suggestions: Optional[List[str]] = None
    legal_templates: Optional[List[str]] = None


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process chat messages using AI/GPT for housing legal assistance
    """
    try:
        response = await ai_service.process_chat(
            messages=request.messages, context=request.context
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze")
async def analyze_situation(situation: dict):
    """
    Analyze a housing legal situation and provide guidance
    """
    try:
        analysis = await ai_service.analyze_legal_situation(situation)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
