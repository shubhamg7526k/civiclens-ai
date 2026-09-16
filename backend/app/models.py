from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime

from .database import Base


class Report(Base):

    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    image_path = Column(String)

    issue_type = Column(String)

    severity = Column(String)

    confidence = Column(Float)

    description = Column(Text)

    suggested_action = Column(Text)

    latitude = Column(Float)

    longitude = Column(Float)

    status = Column(
        String,
        default="Pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )