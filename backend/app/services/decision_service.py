"""Decision Service for legal decision pathways"""
from typing import List, Dict, Optional


class DecisionService:
    """Service for managing decision pathways"""

    def __init__(self):
        self.pathways = self._initialize_pathways()

    def _initialize_pathways(self) -> List[Dict]:
        """Initialize decision pathways"""
        return [
            {
                "id": "eviction",
                "name": "Eviction Process",
                "description": "Navigate the eviction process and understand your rights",
                "steps": [
                    {
                        "id": "step1",
                        "question": "Have you received an eviction notice?",
                        "options": ["Yes", "No"],
                        "next_steps": {"Yes": "step2", "No": "end_no_notice"},
                    },
                    {
                        "id": "step2",
                        "question": "What type of eviction notice did you receive?",
                        "options": ["Section 8", "Section 21", "Other"],
                        "next_steps": {
                            "Section 8": "step3_s8",
                            "Section 21": "step3_s21",
                            "Other": "step3_other",
                        },
                    },
                ],
            },
            {
                "id": "rent_dispute",
                "name": "Rent Dispute Resolution",
                "description": "Resolve disputes related to rent payments or increases",
                "steps": [
                    {
                        "id": "step1",
                        "question": "What is the nature of the rent dispute?",
                        "options": ["Increase", "Payment issue", "Deposit"],
                        "next_steps": {
                            "Increase": "step2_increase",
                            "Payment issue": "step2_payment",
                            "Deposit": "step2_deposit",
                        },
                    }
                ],
            },
            {
                "id": "repairs",
                "name": "Property Repairs",
                "description": "Address issues with property repairs and maintenance",
                "steps": [
                    {
                        "id": "step1",
                        "question": "Have you notified your landlord about the repair needed?",
                        "options": ["Yes", "No"],
                        "next_steps": {"Yes": "step2", "No": "step_notify_first"},
                    }
                ],
            },
        ]

    async def list_pathways(self) -> List[Dict]:
        """List all decision pathways"""
        return self.pathways

    async def get_pathway(self, pathway_id: str) -> Optional[Dict]:
        """Get a specific pathway by ID"""
        for pathway in self.pathways:
            if pathway["id"] == pathway_id:
                return pathway
        return None

    async def evaluate(self, decision_input) -> Dict:
        """
        Evaluate a decision pathway based on user inputs

        Args:
            decision_input: User's answers and context

        Returns:
            Decision result with recommendations
        """
        # Convert to dict if it's a Pydantic model
        if hasattr(decision_input, "model_dump"):
            decision_data = decision_input.model_dump()
        elif hasattr(decision_input, "dict"):
            decision_data = decision_input.dict()
        else:
            decision_data = decision_input

        answers = decision_data.get("answers", {})

        # Mock evaluation - in production, this would use the decision tree
        return {
            "recommendation": "Based on your situation, you should respond to the eviction notice within 14 days.",
            "applicable_templates": [
                "eviction_notice_response",
                "legal_rights_summary",
            ],
            "next_actions": [
                "Document all communications",
                "Seek legal advice",
                "Prepare your defense",
            ],
            "confidence": 0.85,
        }
