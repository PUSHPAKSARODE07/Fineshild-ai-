from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ===============================
# DATABASE INITIALIZATION
# ===============================

from backend.config.db import Base, engine

# Import models so tables are created
from backend.models.user_model import User
from backend.models.analysis_model import Analysis


# ===============================
# ROUTES
# ===============================

from backend.routes.auth_routes \
    import router as auth_router

from backend.routes.analysis_routes \
    import router as analysis_router

from backend.routes.verification_routes \
    import router as verification_router

from backend.routes.history_routes \
    import router as history_router


# ===============================
# CREATE DATABASE TABLES
# ===============================

Base.metadata.create_all(bind=engine)


# ===============================
# FASTAPI APP
# ===============================

app = FastAPI(
    title="FinShield AI",
    description=(
        "AI-powered Financial Identity"
        " & Risk Intelligence Platform"
    ),
    version="1.0.0"
)


# ===============================
# CORS CONFIG
# ===============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===============================
# ROOT HEALTH CHECK
# ===============================

@app.get("/")
def root():
    return {
        "message": "FinShield AI Backend Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# ===============================
# REGISTER ROUTERS
# ===============================

app.include_router(auth_router)
app.include_router(verification_router)
app.include_router(analysis_router)
app.include_router(history_router)
