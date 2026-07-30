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


def get_auth_headers(email: str, username: str, password: str):
    # Register the user
    client.post(
        "/auth/register",
        json={
            "email": email,
            "username": username,
            "password": password
        }
    )
    # Login to get token
    login_response = client.post(
        "/auth/login",
        data={
            "username": email,
            "password": password,
        },
    )
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_authenticated_flow_and_owner_checks():
    # 1. Setup User A and User B
    headers_a = get_auth_headers("usera@example.com", "usera", "pass123")
    headers_b = get_auth_headers("userb@example.com", "userb", "pass123")

    # 2. User A creates a collection
    col_response = client.post(
        "/collections/",
        json={"name": "User A Col", "description": "Desc A"},
        headers=headers_a
    )
    assert col_response.status_code == 200
    col_id = col_response.json()["id"]

    # 3. User A creates a prompt in that collection
    prompt_response = client.post(
        "/prompts/",
        json={
            "title": "User A Prompt",
            "content": "Content A",
            "tags": ["a"],
            "collection_id": col_id
        },
        headers=headers_a
    )
    assert prompt_response.status_code == 200
    prompt_id = prompt_response.json()["id"]

    # 4. User B tries to update User A's collection -> 403 Forbidden
    col_update_response = client.put(
        f"/collections/{col_id}",
        json={"name": "Hacked name"},
        headers=headers_b
    )
    assert col_update_response.status_code == 403

    # 5. User B tries to delete User A's collection -> 403 Forbidden
    col_delete_response = client.delete(
        f"/collections/{col_id}",
        headers=headers_b
    )
    assert col_delete_response.status_code == 403

    # 6. User B tries to update User A's prompt -> 403 Forbidden
    prompt_update_response = client.put(
        f"/prompts/{prompt_id}",
        json={"title": "Hacked title"},
        headers=headers_b
    )
    assert prompt_update_response.status_code == 403

    # 7. User B tries to delete User A's prompt -> 403 Forbidden
    prompt_delete_response = client.delete(
        f"/prompts/{prompt_id}",
        headers=headers_b
    )
    assert prompt_delete_response.status_code == 403

    # 8. User A updates their own prompt -> 200 Success
    prompt_update_ok = client.put(
        f"/prompts/{prompt_id}",
        json={"title": "Updated Title A"},
        headers=headers_a
    )
    assert prompt_update_ok.status_code == 200
    assert prompt_update_ok.json()["title"] == "Updated Title A"

    # 9. User A updates their own collection -> 200 Success
    col_update_ok = client.put(
        f"/collections/{col_id}",
        json={"name": "Updated Col A"},
        headers=headers_a
    )
    assert col_update_ok.status_code == 200
    assert col_update_ok.json()["name"] == "Updated Col A"

    # 10. User A deletes their own prompt -> 200 Success
    prompt_del_ok = client.delete(
        f"/prompts/{prompt_id}",
        headers=headers_a
    )
    assert prompt_del_ok.status_code == 200

    # 11. User A deletes their own collection -> 200 Success
    col_del_ok = client.delete(
        f"/collections/{col_id}",
        headers=headers_a
    )
    assert col_del_ok.status_code == 200


def test_unauthenticated_requests():
    # 1. Trying to create a collection without headers -> 401 Unauthorized
    col_response = client.post(
        "/collections/",
        json={"name": "Unauth Col", "description": "Desc"}
    )
    assert col_response.status_code == 401

    # 2. Trying to create a prompt without headers -> 401 Unauthorized
    prompt_response = client.post(
        "/prompts/",
        json={
            "title": "Unauth Prompt",
            "content": "Content",
            "collection_id": 1
        }
    )
    assert prompt_response.status_code == 401
