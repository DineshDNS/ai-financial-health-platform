from sqlalchemy.orm import Session
from app.models.ai_explanations import AIExplanation


def store_ai_cache(db: Session, user_id: int, type: str, content: str):
    """
    Stores AI explanation in cache.
    If exists → update.
    """

    existing = db.query(AIExplanation).filter(
        AIExplanation.user_id == user_id,
        AIExplanation.type == type
    ).first()

    if existing:
        existing.content = content
    else:
        db.add(AIExplanation(
            user_id=user_id,
            type=type,
            content=content
        ))

    db.commit()


def get_ai_cache(db: Session, user_id: int, type: str):
    """
    Returns cached explanation if exists.
    """

    record = db.query(AIExplanation).filter(
        AIExplanation.user_id == user_id,
        AIExplanation.type == type
    ).first()

    if record:
        return record.content

    return None


def clear_ai_cache(db: Session, user_id: int):
    """
    Deletes all cached AI explanations for a user.
    Called after:
    - Upload
    - Replace
    - Delete
    """

    db.query(AIExplanation).filter(
        AIExplanation.user_id == user_id
    ).delete()

    db.commit()
