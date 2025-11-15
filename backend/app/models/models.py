"""Database models for the application"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class LegalTemplate(Base):
    """Legal template model"""

    __tablename__ = "legal_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    version = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class LegislativeUpdate(Base):
    """Legislative update model"""

    __tablename__ = "legislative_updates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    source = Column(String(255), nullable=False)
    jurisdiction = Column(String(100), nullable=False)
    effective_date = Column(DateTime)
    impact_level = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ChatSession(Base):
    """Chat session model"""

    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255))
    session_data = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DecisionPathway(Base):
    """Decision pathway model"""

    __tablename__ = "decision_pathways"

    id = Column(Integer, primary_key=True, index=True)
    pathway_id = Column(String(100), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    pathway_data = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
