from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth.login import login_for_access_token
from app.db import get_db
from app.dependencies.auth import get_current_user
from app.model.user import User
from app.schemas.user import UserRegistration, UserResponse
from app.services.user_service import create_user, get_user_by_email, get_user_by_username

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserRegistration, db: Session = Depends(get_db)):
    username = (user.username or user.email.split("@")[0]).strip()

    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email is already registered")

    if get_user_by_username(db, username):
        raise HTTPException(status_code=400, detail="Username is already taken")

    user.username = username
    created_user = create_user(db, user)
    return {
        "id": created_user.id,
        "email": created_user.email,
        "username": created_user.username,
        "message": "User registered successfully"
    }

@router.post("/login")
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    # OAuth2 uses "username"; in this app that value is the user's email.
    token_data = login_for_access_token(db, form_data.username, form_data.password)
    return token_data


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "message": "Current user fetched successfully",
    }
