from sqlalchemy import Column, Integer, String
from app.db import Base

class User(Base):
    __tablename__ = "user_info"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    @property
    def password(self):
        return self.hashed_password
    
    @password.setter
    def password(self, password: str):
        from app.auth.hash import hash_password
        self.hashed_password = hash_password(password)