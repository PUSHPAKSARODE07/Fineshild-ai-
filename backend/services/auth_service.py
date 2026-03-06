from backend.config.db import SessionLocal
from backend.models.user_model import User
from backend.core.security import \
    hash_password, verify_password


def register_user(username, password):

    db = SessionLocal()

    user = User(
        username=username,
        password=hash_password(password)
    )

    db.add(user)
    db.commit()

    db.close()

    return {"message": "User created"}
    

def authenticate_user(username, password):

    db = SessionLocal()

    user = db.query(User)\
        .filter(User.username == username)\
        .first()

    db.close()

    if not user:
        return None

    if not verify_password(
            password,
            user.password):
        return None

    return user