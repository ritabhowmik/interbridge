from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import analyze, checklist

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Interbridge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten before any real deployment
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(checklist.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "interbridge-api"}
