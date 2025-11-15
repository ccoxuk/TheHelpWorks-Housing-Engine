"""Tests for legislative updates endpoint"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_updates():
    """Test listing legislative updates"""
    response = client.get("/api/v1/legislative-updates/")
    assert response.status_code == 200
    data = response.json()
    assert "updates" in data
    assert "total" in data


def test_get_update():
    """Test getting a specific update"""
    response = client.get("/api/v1/legislative-updates/1")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "title" in data


def test_list_updates_by_jurisdiction():
    """Test listing updates filtered by jurisdiction"""
    response = client.get("/api/v1/legislative-updates/?jurisdiction=England")
    assert response.status_code == 200
    data = response.json()
    assert "updates" in data


def test_sync_updates():
    """Test manual sync of updates"""
    response = client.post("/api/v1/legislative-updates/sync")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "success"
