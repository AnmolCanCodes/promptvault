from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies.auth import get_current_user
from app.model.user import User
from app.schemas.collection import CollectionCreate, CollectionRead, CollectionUpdate
from app.services.collection_service import (
    create_collection,
    delete_collection,
    get_collection,
    list_collections,
    serialize_collection,
    update_collection,
)

router = APIRouter(prefix="/collections", tags=["collections"])

@router.get("/", response_model=list[CollectionRead])
def read_collections(db: Session = Depends(get_db)):
    return [CollectionRead(**serialize_collection(collection)) for collection in list_collections(db)]

@router.post("/", response_model=CollectionRead)
def create_collection_route(
    collection_data: CollectionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return CollectionRead(**serialize_collection(create_collection(db, collection_data, current_user.id)))

@router.get("/{collection_id}", response_model=CollectionRead)
def read_collection(collection_id: int, db: Session = Depends(get_db)):
    collection = get_collection(db, collection_id)
    if not collection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
    return CollectionRead(**serialize_collection(collection))

# In app/routers/collection.py

@router.put("/{collection_id}", response_model=CollectionRead)
def update_collection_route(
    collection_id: int,
    collection_data: CollectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    collection = get_collection(db, collection_id)
    if not collection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")

    if collection.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, # Changed from 404 to 403
            detail="You do not have permission to modify this collection"
        )

    updated_col = update_collection(db, collection_id, collection_data)
    return CollectionRead(**serialize_collection(updated_col))

@router.delete("/{collection_id}")
def delete_collection_route(
    collection_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    collection = get_collection(db, collection_id)
    if not collection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")

    if collection.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, # Changed from 404 to 403
            detail="You do not have permission to delete this collection"
        )
    delete_collection(db, collection_id)
    return {"message": "Collection deleted successfully"}

