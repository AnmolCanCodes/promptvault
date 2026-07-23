import os
import tempfile

TEMP_DIR = tempfile.mkdtemp(prefix="promptvault-test-", dir="/tmp")
DB_PATH = os.path.join(TEMP_DIR, "promptvault.db")
os.environ["DATABASE_URL"] = f"sqlite:///{DB_PATH}"

from fastapi.testclient import TestClient

from app.main import app
from app.db import Base, engine

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)


def test_create_prompt():
    response = client.post(
        "/prompts/",
        json={
            "title": "Test Prompt",
            "content": "Hello from PromptVault",
            "tags": ["test", "demo"],
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "Test Prompt"
    assert body["content"] == "Hello from PromptVault"
    assert body["tags"] == ["test", "demo"]
