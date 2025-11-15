"""Tests for decision pathways endpoint"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_pathways():
    """Test listing decision pathways"""
    response = client.get("/api/v1/decisions/pathways")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_pathway():
    """Test getting a specific pathway"""
    response = client.get("/api/v1/decisions/pathways/eviction")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "eviction"
    assert "steps" in data


def test_evaluate_decision():
    """Test evaluating a decision"""
    payload = {"answers": {"received_notice": "yes", "notice_type": "section_21"}}
    response = client.post("/api/v1/decisions/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "recommendation" in data
    assert "confidence" in data
