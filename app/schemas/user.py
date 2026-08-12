from pydantic import BaseModel, EmailStr, Field, validator

MAX_BCRYPT_PASSWORD_BYTES = 72

class UserRegistration(BaseModel):
    email: EmailStr
    password: str = Field(min_length=5, max_length=72)
    username: str | None = None

    @validator("password")
    def password_max_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > MAX_BCRYPT_PASSWORD_BYTES:
            raise ValueError("Password cannot be longer than 72 bytes")
        return value

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    message: str
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str


    class Config:
        from_attributes = True