from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
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
def create_collection_route(collection_data: CollectionCreate, db: Session = Depends(get_db)):
    return CollectionRead(**serialize_collection(create_collection(db, collection_data)))

@router.get("/{collection_id}", response_model=CollectionRead)
def read_collection(collection_id: int, db: Session = Depends(get_db)):
    collection = get_collection(db, collection_id)
    if not collection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
    return CollectionRead(**serialize_collection(collection))

@router.put("/{collection_id}", response_model=CollectionRead)
def update_collection_route(collection_id: int, collection_data: CollectionUpdate, db: Session =
Depends(get_db)):
    collection = update_collection(db, collection_id, collection_data)
    if not collection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
    return CollectionRead(**serialize_collection(collection))

@router.delete("/{collection_id}")
def delete_collection_route(collection_id: int, db: Session = Depends(get_db)):
    deleted = delete_collection(db, collection_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
    return {"message": "Collection deleted successfully"}

