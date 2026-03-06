from sqlalchemy.orm import Session

from backend.models.analysis_model import Analysis
from backend.models.user_model import User


def get_user_history(db: Session, username: str):

    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:
        return []

    history = (
        db.query(Analysis)
        .filter(Analysis.user_id == user.id)
        .order_by(Analysis.created_at.desc())
        .all()
    )

    return history
