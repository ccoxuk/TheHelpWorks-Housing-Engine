"""Template Service for managing legal templates with version control"""
from typing import List, Optional, Dict
from datetime import datetime


class TemplateService:
    """Service for managing legal templates"""

    def __init__(self):
        # In production, this would use a database
        self.templates = self._initialize_templates()

    def _initialize_templates(self) -> List[Dict]:
        """Initialize sample templates"""
        return [
            {
                "id": 1,
                "name": "Eviction Notice Response",
                "category": "eviction",
                "content": "Template content for responding to eviction notice...",
                "version": "1.0.0",
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            },
            {
                "id": 2,
                "name": "Rent Dispute Letter",
                "category": "rent",
                "content": "Template content for rent dispute letter...",
                "version": "1.0.0",
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            },
            {
                "id": 3,
                "name": "Repair Request Form",
                "category": "repairs",
                "content": "Template content for repair request...",
                "version": "1.0.0",
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            },
        ]

    async def list_templates(self, category: Optional[str] = None) -> List[Dict]:
        """
        List all templates, optionally filtered by category

        Args:
            category: Optional category filter

        Returns:
            List of templates
        """
        if category:
            return [t for t in self.templates if t["category"] == category]
        return self.templates

    async def get_template(self, template_id: int) -> Optional[Dict]:
        """
        Get a specific template by ID

        Args:
            template_id: Template ID

        Returns:
            Template or None
        """
        for template in self.templates:
            if template["id"] == template_id:
                return template
        return None

    async def create_template(self, template: Dict) -> Dict:
        """
        Create a new template with version control

        Args:
            template: Template data

        Returns:
            Created template
        """
        new_id = max([t["id"] for t in self.templates], default=0) + 1
        new_template = {
            **template,
            "id": new_id,
            "version": "1.0.0",
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
        self.templates.append(new_template)
        return new_template

    async def get_template_versions(self, template_id: int) -> List[Dict]:
        """
        Get version history for a template

        Args:
            template_id: Template ID

        Returns:
            List of versions
        """
        # Mock version history - in production, this would track actual versions
        template = await self.get_template(template_id)
        if not template:
            return []

        return [
            {
                "version": "1.0.0",
                "created_at": template["created_at"],
                "changes": "Initial version",
            }
        ]
