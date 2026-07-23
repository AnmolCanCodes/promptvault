from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.prompt import PromptCreate, PromptRead, PromptUpdate
from app.services.prompt_service import (
    create_prompt,
    delete_prompt,
    get_prompt,
    list_prompts,
    serialize_prompt,
    update_prompt,
)

router = APIRouter(prefix="/prompts", tags=["prompts"])


@router.get("/", response_model=list[PromptRead])
def read_prompts(db: Session = Depends(get_db)):
    return [PromptRead(**serialize_prompt(prompt)) for prompt in list_prompts(db)]


@router.post("/", response_model=PromptRead)
def create_prompt_route(prompt_data: PromptCreate, db: Session = Depends(get_db)):
    return PromptRead(**serialize_prompt(create_prompt(db, prompt_data)))


@router.get("/{prompt_id}", response_model=PromptRead)
def read_prompt(prompt_id: int, db: Session = Depends(get_db)):
    prompt = get_prompt(db, prompt_id)
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found")
    return PromptRead(**serialize_prompt(prompt))


@router.put("/{prompt_id}", response_model=PromptRead)
def update_prompt_route(prompt_id: int, prompt_data: PromptUpdate, db: Session = Depends(get_db)):
    prompt = update_prompt(db, prompt_id, prompt_data)
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found")
    return PromptRead(**serialize_prompt(prompt))


@router.delete("/{prompt_id}")
def delete_prompt_route(prompt_id: int, db: Session = Depends(get_db)):
    deleted = delete_prompt(db, prompt_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found")
    return {"message": "Prompt deleted successfully"}
