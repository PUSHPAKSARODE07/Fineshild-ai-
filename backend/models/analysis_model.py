from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime,
    ForeignKey
)

from datetime import datetime
from backend.config.db import Base


class Analysis(Base):

    __tablename__ = "analysis"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    fraud_score = Column(Float)
    distress_score = Column(Float)
    identity_confidence = Column(Float)

    final_risk_score = Column(Float)
    risk_level = Column(String)

    total_transactions = Column(Integer)
    explanation = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
