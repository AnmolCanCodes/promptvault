from fastapi import FastAPI

from app.db import Base, engine
from app.routers import auth, prompts , collection
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PromptVault",
    description="A secure platform for managing prompts.",
    version="1.0.0",
)

app.include_router(auth.router)
app.include_router(prompts.router)
app.include_router(collection.router) 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return {"message": "Welcome to PromptVault!"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)