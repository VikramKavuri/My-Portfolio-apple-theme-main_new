from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Dict, Any, List
import uuid
import numpy as np
from datetime import datetime

from rag_service import RES_INDEXES, _embedder, score_against_resume, top_keywords
from gen import reasons_reply

app = FastAPI()

# Build the origins list once
origins_env = os.getenv("ALLOWED_ORIGINS", "")
origins = [o.strip() for o in origins_env.split(",") if o.strip()] \
          or ["https://my-portfolio-apple-theme-mainnew.vercel.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # only once
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    job_description: str

class MatchResponse(BaseModel):
    top_keywords: List[str]
    results: Dict[str, Any]  # { resume_name: { score: float, reasons: str } }

@app.post("/match", response_model=MatchResponse)
def match(req: MatchRequest):
    jd = req.job_description.strip()
    if not jd:
        return {"top_keywords": [], "results": {}}

    # Embedding for the full JD
    jd_embed = _embedder.encode([jd], convert_to_numpy=True, normalize_embeddings=True)[0]

    keywords = top_keywords(jd, n=10)
    results = {}

    # For each fixed resume, compute score + gather top snippets for RAG
    for idx in RES_INDEXES:
        score, top_pairs = score_against_resume(jd_embed, idx, top_k=6)
        # Prepare small context for generation (keep under token limits)
        retrieved = [c for (c, s) in top_pairs][:6]
        reasons = reasons_reply(jd, keywords, retrieved)
        results[idx.name] = {
            "score": round(score, 1),
            "reasons": reasons
        }

    return {"top_keywords": keywords, "results": results}

@app.get("/healthz")
def health():
    return {"ok": True}
