from sqlalchemy.orm import Session
from app.model.collection import Collection
from app.model.prompt import Prompt
from app.schemas.collection import CollectionCreate, CollectionUpdate


def get_prompt_count(db: Session, collection_id: int) -> int:
    return db.query(Prompt).filter(Prompt.collection_id == collection_id).count()


def serialize_collection(collection: Collection, prompt_count: int | None = None) -> dict:
    return {
        "id": collection.id,
        "name": collection.name,
        "description": collection.description,
        "user_id": collection.user_id,
        "created_at": collection.created_at.isoformat() if collection.created_at else None,
        "prompt_count": prompt_count if prompt_count is not None else 0,
    }

def create_collection(db: Session, collection_data: CollectionCreate , user_id: int) -> Collection:
    collection = Collection(
        name=collection_data.name,
        description=collection_data.description,
        user_id=user_id,
    )
    db.add(collection)
    db.commit()
    db.refresh(collection)
    return collection

def list_collections(db: Session) -> list[Collection]:
    return db.query(Collection).order_by(Collection.created_at.desc()).all()

def get_collection(db: Session, collection_id: int) -> Collection | None:
    return db.query(Collection).filter(Collection.id == collection_id).first()

def update_collection(db: Session, collection_id: int, collection_data: CollectionUpdate) -> Collection | None:
    collection = get_collection(db, collection_id)
    if not collection:
        return None

    if collection_data.name is not None:
        collection.name = collection_data.name
    if collection_data.description is not None:
        collection.description = collection_data.description

    db.commit()
    return collection

def delete_collection(db: Session, collection_id: int) -> bool:
    collection = get_collection(db, collection_id)
    if not collection:
        return False
    db.delete(collection)
    db.commit()
    return True


