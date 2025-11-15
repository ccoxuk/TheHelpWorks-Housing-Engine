"""Tests for legal templates endpoint"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_templates():
    """Test listing templates"""
    response = client.get("/api/v1/legal-templates/")
    assert response.status_code == 200
    data = response.json()
    assert "templates" in data
    assert "total" in data


def test_get_template():
    """Test getting a specific template"""
    response = client.get("/api/v1/legal-templates/1")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "name" in data


def test_list_templates_by_category():
    """Test listing templates filtered by category"""
    response = client.get("/api/v1/legal-templates/?category=eviction")
    assert response.status_code == 200
    data = response.json()
    assert "templates" in data


def test_get_template_versions():
    """Test getting template version history"""
    response = client.get("/api/v1/legal-templates/1/versions")
    assert response.status_code == 200
    data = response.json()
    assert "versions" in data
