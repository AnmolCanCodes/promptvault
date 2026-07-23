from sqlalchemy.orm import Session
from app.model.user import User
from app.schemas.user import UserRegistration, UserLogin
from app.auth.hash import hash_password, verify_password


def get_next_available_user_id(db: Session) -> int:
    existing_ids = {user_id for (user_id,) in db.query(User.id).all()}

    if not existing_ids:
        return 1

    for candidate_id in range(1, max(existing_ids) + 2):
        if candidate_id not in existing_ids:
            return candidate_id

    return max(existing_ids) + 1


def create_user(db: Session, user: UserRegistration) -> User:
    hashed_password = hash_password(user.password)
    db_user = User(
        id=get_next_available_user_id(db),
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, user: UserLogin) -> User | None:
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        return None
    if not verify_password(user.password, db_user.hashed_password):
        return None
    return db_user

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()