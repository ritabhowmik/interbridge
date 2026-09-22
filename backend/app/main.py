from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routers.check import router as check_router  # noqa: E402

app = FastAPI(
    title="interbridge api",
    description="tells a business which provincial regulations block their expansion. "
    "demo / hackathon project — not legal advice.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(check_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
