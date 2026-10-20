# PromptVault

PromptVault is a secure prompt management application built with FastAPI. It allows users to create, organize, and manage AI prompts and prompt collections in a structured and authenticated environment. The project is designed for teams and individuals who want a centralized place to store reusable prompts for tools such as ChatGPT, Claude, Gemini, and similar AI platforms.

## Live Demo

The project is currently live at:

https://promptvault-ten-rho.vercel.app

> This frontend deployment is available for preview, but for full local development and backend testing, you should clone the repository and run the backend locally.

---

## What PromptVault Does

PromptVault provides a backend API for:

- user registration and login
- JWT-based authentication
- protected user dashboards and personal collections
- prompt creation and retrieval
- collection-based organization of prompts
- ownership-based authorization to ensure users only manage their own data
- API integration with frontend applications

In simple terms, PromptVault acts as a secure vault for AI prompts where users can store prompt templates, group them into collections, and access them safely through authenticated requests.

---

## How It Works

The application follows a typical modern full-stack flow:

1. A user registers with email and password.
2. The backend validates the data and creates a user record.
3. The user logs in with their email and password.
4. The backend verifies credentials and issues a JWT access token.
5. That token is sent as a Bearer token in future requests.
6. The backend reads the token, validates it, and extracts the user identity.
7. Protected API routes check whether the current user is allowed to access or modify the requested resource.
8. If the user is unauthorized, the API responds with a 401 or 403 status.

This keeps the system secure while allowing the frontend to work with private user data without exposing raw credentials or storing session state insecurely in the browser.

---

## Core Features

### 1. User Authentication
- user registration
- login flow
- password hashing
- secure JWT issuance

### 2. Authorization and Ownership Control
- authenticated routes require a valid token
- users can only modify their own collections and prompts
- the backend rejects unauthorized actions with `401 Unauthorized` or `403 Forbidden`

### 3. Prompt Management
- create prompts
- read prompts
- update prompts
- delete prompts

### 4. Collection Management
- create collections
- view collections and prompt counts
- update collection details
- delete collections
- add prompts under a specific collection

### 5. API-first Backend
- FastAPI routes with Pydantic validation
- clean request/response models
- automatic OpenAPI docs at `/docs`
- easy integration with frontend or external clients

### 6. Security Practices
- password hashing before saving
- secret key validation at startup
- JWT expiration handling
- ownership checks before mutation of user data

---

## Tech Stack

- Python 3.10+
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL-compatible database support
- JWT via `python-jose`
- SQLite for local development by default
- React frontend in the companion `promptvault-frontend` folder

---

## Project Structure

```text
PromptVault/
├── app/
│   ├── auth/
│   │   ├── hash.py
│   │   ├── jwt.py
│   │   └── login.py
│   ├── dependencies/
│   │   └── auth.py
│   ├── model/
│   │   ├── collection.py
│   │   ├── prompt.py
│   │   └── user.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── collection.py
│   │   └── prompts.py
│   ├── schemas/
│   │   ├── collection.py
│   │   ├── prompt.py
│   │   └── user.py
│   ├── services/
│   │   ├── collection_service.py
│   │   ├── prompt_service.py
│   │   └── user_service.py
│   ├── config.py
│   ├── db.py
│   ├── main.py
│   └── requirements.txt
├── promptvault-frontend/
├── tests/
├── README.md
├── requirements.txt
└── main.py
```

---

## End-to-End JWT Authentication and Authorization Flow

This project implements a practical backend authentication workflow.

### 1. User Registration
A request is sent to:

```http
POST /auth/register
```

The backend:
- validates the request payload
- ensures the email is unique
- ensures the username is unique
- hashes the password
- stores the user in the database

### 2. Login and Token Generation
A user logs in using:

```http
POST /auth/login
```

The backend uses an OAuth2 password request form and calls the login logic. The login function:
- checks whether the email exists
- verifies the submitted password with the hashed password stored in the database
- creates an access token if valid

The token payload includes the subject and user identifier:

```python
{"sub": user.email, "user_id": user.id}
```

The token is signed with the configured secret and algorithm, and includes an expiration time.

### 3. Token Verification
The token validation logic is in `app/auth/jwt.py` and is responsible for:

- decoding the JWT with the configured secret and algorithm
- reading the token claims
- checking if the `sub` field exists
- raising a credential error if invalid or expired

Example behavior:

```python
payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
email: str = payload.get("sub")
```

### 4. Protected Route Access
The dependency in `app/dependencies/auth.py` uses `OAuth2PasswordBearer` to read a `Bearer` token from the `Authorization` header.

It then:
- validates the token
- loads the user from the database
- returns the authenticated user object

Any protected endpoint depends on this function, for example:

```python
current_user: User = Depends(get_current_user)
```

### 5. Authorization Checks
The project enforces resource ownership using user IDs.

For example, in the prompt and collection routes:

```python
if collection.user_id != current_user.id:
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to modify this collection"
    )
```

This is an important backend practice:
- authentication proves who the user is
- authorization proves what the user is allowed to do

The backend does not trust the client. It always re-checks user ownership on the server side.

### 6. JWT Payload Practice in This Project
The backend uses a minimal and practical payload pattern:

```python
{"sub": user.email, "user_id": user.id}
```

Why this is useful:
- `sub` is a standard claim used to identify the subject/user
- `user_id` gives direct access to the database record without needing additional lookup during initial authentication
- an expiration time is attached to the token to reduce risk from stolen tokens

This is a clean and common pattern for backend security in FastAPI projects.

---

## Backend Security Principles Used in This Project

This project demonstrates several important backend practices:

- password hashing before storage
- JWT secret management with environment-based configuration
- short-lived token expiration
- protected endpoints requiring valid Bearer tokens
- ownership authorization for collections and prompts
- database-based identity checks instead of client-side trust

---

## Local Setup for End-to-End Development

If you want to run the project locally, follow these steps.

### 1. Clone the repository

```bash
git clone https://github.com/AnmolCanCodes/promptvault.git
cd PromptVault
```

### 2. Create a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install backend dependencies

```bash
pip install -r app/requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root with values like:

```env
DATABASE_URL=sqlite:///./promptvault.db
JWT_SECRET_KEY=replace-with-a-secure-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> Important: do not leave the default insecure JWT secret in production. Use a strong random value.

Example:

```bash
export JWT_SECRET_KEY="$(openssl rand -hex 32)"
```

### 5. Run the backend

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

- http://127.0.0.1:8000/
- http://127.0.0.1:8000/docs

### 6. Run the frontend locally

Open a second terminal and run:

```bash
cd promptvault-frontend
npm install
npm run dev
```

The frontend should run on a Vite dev server such as:

- http://localhost:5173

This setup allows the full application to work end to end locally: the frontend talks to the local FastAPI backend, and the JWT authentication flow is tested in real time.

---

## API Endpoints

### Authentication
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Collections
- `GET /collections/`
- `POST /collections/`
- `GET /collections/{collection_id}`
- `PUT /collections/{collection_id}`
- `DELETE /collections/{collection_id}`
- `GET /collections/{collection_id}/prompts`
- `POST /collections/{collection_id}/prompts`

### Prompts
- `GET /prompts/`
- `POST /prompts/`
- `GET /prompts/{prompt_id}`
- `PUT /prompts/{prompt_id}`
- `DELETE /prompts/{prompt_id}`

### Health
- `GET /health`

---

## Notes

PromptVault is intentionally structured as a practical backend-first project. It demonstrates how to build a secure prompt management system with authentication, protected routes, ownership checks, and clean API design. It is a good example of a real-world FastAPI application that focuses on user safety, backend correctness, and scalable API patterns.

If you want, this project can be extended with:
- role-based access control
- pagination
- search and filtering
- tags and favorites
- prompt versions/history
- deployment-ready PostgreSQL configuration
- CI/CD and automated testing



