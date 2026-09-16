from sqlalchemy.orm import Session

from .models import Report


def create_report(
    db: Session,
    image_path,
    ai_result,
    latitude=None,
    longitude=None
):

    report = Report(

        image_path=image_path,

        issue_type=ai_result["issue_type"],

        severity=ai_result["severity"],

        confidence=ai_result["confidence"],

        description=ai_result["description"],

        suggested_action=ai_result["suggested_action"],

        latitude=latitude,

        longitude=longitude,

        status="Pending"
    )

    db.add(report)

    db.commit()

    db.refresh(report)

    return report