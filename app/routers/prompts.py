from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies.auth import get_current_user
from app.model.user import User
from app.schemas.prompt import PromptCreate, PromptRead, PromptUpdate
from app.services.collection_service import get_collection 
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
def create_prompt_route(
    prompt_data: PromptCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    collection = get_collection(db, prompt_data.collection_id)
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"Collection with id {prompt_data.collection_id} was not found. "
                "Create a collection first via POST /collections/, then use that id as collection_id."
            ),
        )
    
    if collection.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not have permission to add prompts to this collection"
        )
    return PromptRead(**serialize_prompt(create_prompt(db, prompt_data)))


    


@router.get("/{prompt_id}", response_model=PromptRead)
def read_prompt(prompt_id: int, db: Session = Depends(get_db)):
    prompt = get_prompt(db, prompt_id)
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found")
    return PromptRead(**serialize_prompt(prompt))


@router.put("/{prompt_id}", response_model=PromptRead)
def update_prompt_route(
    prompt_id: int, 
    prompt_data: PromptUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prompt = get_prompt(db, prompt_id)
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found")
    collection = get_collection(db, prompt.collection_id)
    if not collection or collection.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not have permission to modify this prompt"
        )
    updated_prompt = update_prompt(db, prompt_id, prompt_data)
    return PromptRead(**serialize_prompt(updated_prompt))


@router.delete("/{prompt_id}")
def delete_prompt_route(
    prompt_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prompt = get_prompt(db, prompt_id)
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prompt not found")
    collection = get_collection(db, prompt.collection_id)
    if not collection or collection.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not have permission to delete this prompt"
        )
    delete_prompt(db, prompt_id)
    return {"message": "Prompt deleted successfully"}
