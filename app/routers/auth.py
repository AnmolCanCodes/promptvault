from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.login import login_for_access_token
from app.db import SessionLocal
from app.schemas.user import UserLogin, UserRegistration, UserResponse
from app.services.user_service import authenticate_user, create_user

router = APIRouter(prefix="/auth", tags=["auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserRegistration, db: Session = Depends(get_db)):
    created_user = create_user(db, user)
    return {
        "email": created_user.email,
        "username": created_user.username,
        "message": "User registered successfully"
    }

@router.post("/login")
async def login_user(user: UserLogin, db: Session = Depends(get_db)):
    token_data = login_for_access_token(db, user.email, user.password)
    return token_data