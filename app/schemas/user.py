from pydantic import BaseModel, EmailStr, Field

class UserRegistration(BaseModel):
    email: EmailStr
    password: str = Field(min_length=5, max_length=72)
    username: str | None = None

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