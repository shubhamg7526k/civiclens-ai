from pydantic import BaseModel
from typing import Optional


class ReportResponse(BaseModel):

    id: int

    issue_type: str

    severity: str

    confidence: float

    description: str

    suggested_action: str

    latitude: Optional[float]

    longitude: Optional[float]

    status: str

    image_path: str

    class Config:
        from_attributes = True