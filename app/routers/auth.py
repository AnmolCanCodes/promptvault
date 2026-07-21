from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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

@router.post("/login", response_model=UserResponse)
async def login_user(user: UserLogin, db: Session = Depends(get_db)):
    authenticated_user = authenticate_user(db, user)
    if not authenticated_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "email": authenticated_user.email,
        "username": authenticated_user.username,
        "message": "Login successful",
    }