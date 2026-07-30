from typing import Optional

from pydantic import BaseModel, Field


class PromptBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    tags: list[str] = Field(default_factory=list)


class PromptCreate(PromptBase):
    collection_id: int


class PromptUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    content: Optional[str] = Field(default=None, min_length=1)
    tags: Optional[list[str]] = None


class PromptRead(PromptBase):
    id: int
    collection_id: int

    class Config:
        from_attributes = True
