# One function:
# get_current_user()
# Every router reuses it.
# That's why this folder exists.


from fastapi import Depends, HTTPException 
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.auth.jwt import verify_access_token
from app.db import SessionLocal
from app.services.user_service import get_user_by_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")





