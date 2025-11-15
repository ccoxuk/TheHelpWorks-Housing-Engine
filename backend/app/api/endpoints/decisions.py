"""Decision engine endpoint for legal decision pathways"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.services.decision_service import DecisionService

router = APIRouter()
decision_service = DecisionService()


class DecisionInput(BaseModel):
    """Input for decision pathway"""

    answers: Dict[str, str]
    context: Optional[Dict] = None


class DecisionStep(BaseModel):
    """A step in the decision pathway"""

    id: str
    question: str
    options: List[str]
    next_steps: Dict[str, str]


class DecisionPathway(BaseModel):
    """Complete decision pathway"""

    id: str
    name: str
    description: str
    steps: List[DecisionStep]


class DecisionResult(BaseModel):
    """Result from decision pathway"""

    recommendation: str
    applicable_templates: List[str]
    next_actions: List[str]
    confidence: float


@router.get("/pathways", response_model=List[DecisionPathway])
async def list_pathways():
    """
    List all available decision pathways
    """
    try:
        pathways = await decision_service.list_pathways()
        return pathways
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/pathways/{pathway_id}", response_model=DecisionPathway)
async def get_pathway(pathway_id: str):
    """
    Get a specific decision pathway
    """
    try:
        pathway = await decision_service.get_pathway(pathway_id)
        if not pathway:
            raise HTTPException(status_code=404, detail="Pathway not found")
        return pathway
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate", response_model=DecisionResult)
async def evaluate_decision(decision_input: DecisionInput):
    """
    Evaluate a decision pathway based on user inputs
    """
    try:
        result = await decision_service.evaluate(decision_input)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
