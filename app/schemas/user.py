from pydantic import BaseModel, EmailStr

class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    username: str

class UserResponse(BaseModel):
    email: EmailStr
    username: str
    message: str
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str


    class Config:
        from_attributes = True