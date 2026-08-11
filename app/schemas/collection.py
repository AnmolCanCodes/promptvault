from pydantic import BaseModel, Field
from typing import Optional

class CollectionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(default="", max_length=1000)
    

class CollectionCreate(CollectionBase):
    pass


class CollectionUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)

class CollectionRead(CollectionBase):
    id: int
    user_id: int
    prompt_count: int = 0

    class Config:
        from_attributes = True