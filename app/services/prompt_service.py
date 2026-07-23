from sqlalchemy.orm import Session

from app.model.prompt import Prompt
from app.schemas.prompt import PromptCreate, PromptUpdate


def _tags_to_string(tags: list[str] | None) -> str:
    if not tags:
        return ""
    return ",".join(tag.strip() for tag in tags if tag.strip())


def _tags_from_string(raw: str | None) -> list[str]:
    if not raw:
        return []
    return [tag.strip() for tag in raw.split(",") if tag.strip()]


def serialize_prompt(prompt: Prompt) -> dict:
    return {
        "id": prompt.id,
        "title": prompt.title,
        "content": prompt.content,
        "tags": _tags_from_string(prompt.tags),
    }


def create_prompt(db: Session, prompt_data: PromptCreate) -> Prompt:
    prompt = Prompt(
        title=prompt_data.title,
        content=prompt_data.content,
        tags=_tags_to_string(prompt_data.tags),
    )
    db.add(prompt)
    db.commit()
    db.refresh(prompt)
    return prompt


def list_prompts(db: Session) -> list[Prompt]:
    return db.query(Prompt).order_by(Prompt.created_at.desc()).all()


def get_prompt(db: Session, prompt_id: int) -> Prompt | None:
    return db.query(Prompt).filter(Prompt.id == prompt_id).first()


def update_prompt(db: Session, prompt_id: int, prompt_data: PromptUpdate) -> Prompt | None:
    prompt = get_prompt(db, prompt_id)
    if not prompt:
        return None

    if prompt_data.title is not None:
        prompt.title = prompt_data.title
    if prompt_data.content is not None:
        prompt.content = prompt_data.content
    if prompt_data.tags is not None:
        prompt.tags = _tags_to_string(prompt_data.tags)

    db.commit()
    db.refresh(prompt)
    return prompt


def delete_prompt(db: Session, prompt_id: int) -> bool:
    prompt = get_prompt(db, prompt_id)
    if not prompt:
        return False

    db.delete(prompt)
    db.commit()
    return True
