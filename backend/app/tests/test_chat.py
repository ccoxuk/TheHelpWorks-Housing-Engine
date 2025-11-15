"""Tests for chat endpoint"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "operational"


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_chat_endpoint():
    """Test chat endpoint"""
    payload = {
        "messages": [{"role": "user", "content": "I received an eviction notice"}]
    }
    response = client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "suggestions" in data


def test_chat_analyze():
    """Test situation analysis endpoint"""
    payload = {"situation_type": "eviction", "details": "Received Section 21 notice"}
    response = client.post("/api/v1/chat/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "severity" in data
    assert "recommended_actions" in data
