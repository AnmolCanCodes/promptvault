# PromptVault

PromptVault is a FastAPI-based backend application for managing AI prompts and prompt collections. It provides a secure and structured way to register users, authenticate sessions, and manage prompts for tools such as ChatGPT, Claude, and Gemini.

## Overview

PromptVault is designed to help teams and individuals:

- store prompts in a centralized place
- organize prompts by collection and tags
- version and reuse prompts safely
- authenticate users with JWT-based security
- expose a clean API for frontend integrations

## Features

- User registration and login
- JWT authentication
- Prompt collection management
- Prompt storage and retrieval
- Secure password handling
- Health check endpoint

## Tech Stack

- Python 3.10+
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL-compatible database support
- JWT authentication via python-jose

## Project Structure

```text
app/
├── auth/
├── model/
├── routers/
├── schemas/
├── services/
├── config.py
├── db.py
├── main.py
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd PromptVault
```

### 2. Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r app/requirements.txt
```


Example values:

```env
DATABASE_URL=sqlite:///./promptvault.db
JWT_SECRET_KEY=replace-with-a-secure-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Run the application

```bash
uvicorn app.main:app --reload
```

The API will be available at:

- http://127.0.0.1:8000/
- http://127.0.0.1:8000/docs

## API Endpoints

- POST /auth/register
- POST /auth/login
- GET /health



