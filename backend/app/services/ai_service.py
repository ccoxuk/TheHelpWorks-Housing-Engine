"""AI Service for GPT-based Q&A processing"""
from typing import List, Dict, Optional
from app.core.config import settings


class AIService:
    """Service for AI-powered chat and analysis"""

    def __init__(self):
        self.model = settings.OPENAI_MODEL
        self.api_key = settings.OPENAI_API_KEY

    async def process_chat(
        self, messages: List, context: Optional[Dict] = None
    ) -> Dict:
        """
        Process chat messages using GPT for housing legal assistance

        Args:
            messages: List of chat messages
            context: Optional context information

        Returns:
            Chat response with suggestions and legal templates
        """
        # In a real implementation, this would call OpenAI API
        # For now, return a structured response

        # Convert messages to dict if they are Pydantic models
        messages_list = [
            m
            if isinstance(m, dict)
            else (m.model_dump() if hasattr(m, "model_dump") else m.dict())
            for m in messages
        ]

        user_message = messages_list[-1]["content"] if messages_list else ""

        # Mock response - in production, this would use OpenAI API
        response = {
            "message": f"I understand you're asking about: {user_message}. "
            "Let me help you with your housing legal issue.",
            "suggestions": [
                "Review your tenancy agreement",
                "Document all communications with your landlord",
                "Check your local housing laws",
            ],
            "legal_templates": ["eviction_notice_response", "rent_dispute_letter"],
        }

        return response

    async def analyze_legal_situation(self, situation: Dict) -> Dict:
        """
        Analyze a housing legal situation using AI

        Args:
            situation: Dictionary containing situation details

        Returns:
            Analysis with recommendations
        """
        # Mock analysis - in production, this would use advanced AI processing
        return {
            "severity": "medium",
            "recommended_actions": [
                "Seek legal advice",
                "Document the situation",
                "Review your rights",
            ],
            "applicable_laws": ["Housing Act 2004", "Landlord and Tenant Act 1985"],
            "next_steps": [
                "Gather evidence",
                "Contact housing authority",
                "Consider mediation",
            ],
        }
